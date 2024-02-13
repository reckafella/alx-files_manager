import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

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
      .insertOne({ email, password: sha1(password) });

    const userId = createdUser.insertedId.toString();
    queue.add({ userId });

    response.status(201).json({ userId, email });
  }
}
