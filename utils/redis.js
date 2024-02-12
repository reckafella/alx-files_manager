const redis = require('redis');

/**
 * Represents a Redis client for interacting with a Redis Server
 */
class RedisClient {
  /**
   * Creates an Instance of RedisClient
   */
  constructor() {
    this.client = redis.createClient();
    this.alive = true;

    this.client
      .on('error', (err) => {
        console.log(err.message || err.toString());
        this.alive = false;
      })
      .on('connect', () => {
        this.alive = true;
      });
  }

  /**
   * Checks if the connection to Redis is a success
   * @returns {boolean} true when the connection to Redis is a success otherwise, false
   */
  isAlive() {
    return this.alive;
  }

  /**
   * Retrieves the value stored in Redis for the specified key
   * @param {string} key - The key to retrieve the value for
   * @returns {Promise<any>} A promise that resolves with the value stored for the key\
   * or rejects with an error if an error occurs
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Stores a value in Redis with an expiration set by the duration argument.
   * @param {string} key - The key under which to store the value.
   * @param {any} value - The value to store.
   * @param {number} duration - The duration in seconds for which to store the value.
   * @returns {Promise<string>} A promise that resolves with the result of the SETEX command,\
   * or rejects with an error if an error occurs.
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Removes the value in Redis for the specified key.
   * @param {string} key - The key for which to remove the value.
   * @returns {Promise<number>} A promise that resolves with the number of keys that were removed,\
   * or rejects with an error if an error occurs.
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
module.exports = redisClient;
