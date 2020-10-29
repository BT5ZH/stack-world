// Express pgApp Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const redisClient = require("./redisSetup");
const { pgClient, redisClient, redisPublisher } = require("./dbsSetup");

const pgApp = express();

// 1) MIDDLEWARE

pgApp.use(cors());
pgApp.use(bodyParser.json());

// Express route handlers

pgApp.get("/", (req, res) => {
  res.send("Hi");
});

pgApp.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

pgApp.get("/values/current", async (req, res) => {
  console.log("--------------------111");
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

pgApp.post("/values", async (req, res) => {
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

module.exports = pgApp;
