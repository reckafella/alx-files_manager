import mongodb from 'mongodb';
//  import Collection from 'mongodb/lib/collection';

/**
 * Module with a class that creates a client to MongoDB
 */
class DBClient {
  /**
   * creates a client to MongoDB
   */
  constructor() {
    this.client = null;

    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}/${this.database}`;

    this.client = new mongodb.MongoClient(this.url,
      { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect();
  }

  /**
   * Checks if the connection to MongoDB is a success
   * @returns {boolean} true when the connection to MongoDB is a success otherwise, false
   */
  isAlive() {
    return this.client.topology.isConnected();
  }

  /**
   * returns the number of documents in the collection users
   * @returns {Promise<number>} the number of documents in the collection users
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * returns the number of documents in the collection users
   * @returns {Promise<number>} the number of documents in the collection files
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * returns all documents in the collection users
   * @returns {Promise<Collection>}
   */
  async userCollections() {
    return this.client.db().collection('users');
  }

  /**
   * returns all documents in the collection files
   * @returns {Promise<Collection>}
   */
  async fileCollections() {
    return this.client.db().collection('files');
  }
}

const dbClient = new DBClient();
export default dbClient;
module.exports = dbClient;
