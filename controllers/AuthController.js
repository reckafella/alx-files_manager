import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import Utils from '../utils/utils';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(request, response) {
    const authHeader = request.headers ? request.headers.authorization : null;

    if (!authHeader) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const base64Credentials = authHeader.split(' ')[1];

    if (!base64Credentials) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const credentials = Buffer.from(base64Credentials, 'base64')
      .toString('utf-8');

    const [email, password] = credentials.split(':');

    if (!email || !password) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await (await dbClient.userCollections()).findOne({ email });

    if (!user || user.password !== Utils.hashPassword(password)) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const accessToken = uuidv4().toString();
    const duration = 24 * 60 * 60;
    const userId = user._id.toString();

    await redisClient.set(`token_${accessToken}`, userId, duration);

    response.status(200).json({ accessToken });
  }

  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];

    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = await redisClient.get(`token_${token}`);

    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await (await dbClient.userCollections()).findOne({ _id: new ObjectId(userId) });

    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await redisClient.del(`token_${token}`);

    response.status(204).send();
  }
}
