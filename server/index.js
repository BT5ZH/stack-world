const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// 1) MIDDLEWARE

app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on("error", () => console.log("Lost PG connecyion"));
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((err) => console.log({ err }));

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  console.log("--------------------111");
  redisClient.hgetall("values", (err, values) => {
    console.log("--------------------");
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  console.log("--------------------222  " + index);
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too large");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
