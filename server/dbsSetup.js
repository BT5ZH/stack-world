const keys = require("./keys");
const mongoose = require("mongoose");

// Postgres Client Setup
/*
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on("error", () => console.log("Lost PG connection"));
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((err) => console.log({ err }));
*/

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// module.exports.pgClient = pgClient;
module.exports.redisClient = redisClient;
module.exports.redisPublisher = redisPublisher;
