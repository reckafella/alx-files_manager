import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
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
    response.status(201).json({ userId, email });
  }
}

export default UsersController;
module.exports = UsersController;
