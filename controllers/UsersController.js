import Queue from 'bull/lib/queue';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import Utils from '../utils/utils';
import redisClient from '../utils/redis';

const queue = new Queue('sending email');
export default class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body ? request.body : null;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }

    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const user = await (await dbClient.userCollections()).findOne({ email });
    if (user) {
      response.status(400).json({ error: 'Already exist' });
      return;
    }

    const createdUser = await (await dbClient.userCollections())
      .insertOne({ email, password: Utils.hashPassword(password) });

    const userId = createdUser.insertedId.toString('utf-8');
    queue.add({ userId });

    response.status(201).json({ userId, email });
  }

  static async getMe(request, response) {
    const token = request.headers['x-token'];

    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await (await dbClient.userCollections()).findOne({ _id: new ObjectId(userId) });

    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    response.status(200).json({ id: user._id, email: user.email });
  }
}
