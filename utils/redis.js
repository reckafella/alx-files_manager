const redis = require('redis');

class RedisClient {
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

  // returns true when the connection to Redis is a success otherwise, false
  isAlive() {
    return this.alive;
  }

  //  asynchronous function `get` that takes a string key as argument and\
  // returns the Redis value stored for this key
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

  // asynchronous function `set` that takes a string key, a value and a duration
  // in second as arguments to store it in Redis (with an expiration set by the duration argument)
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

  // asynchronous function del that takes a string key as argument and\
  // remove the value in Redis for this key
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
