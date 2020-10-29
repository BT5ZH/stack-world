// const keys = require("./keys");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// const pgApp = require("./pgApp");
// const pgPort = process.env.PGSPORT || 5001;
// const pgAppServer = pgApp.listen(pgPort, (err) => {
//   console.log(`App running on port ${pgPort}...`);
// });

const mgApp = require("./mgApp");

// MongoDB Client Setup
const DB =
  "mongodb://btUser:btPass@mongodb:27017/stack-learning?authSource=admin";
// const DB = "mongodb://root:zhanghuiquan@mongodb:27017/admin";
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successful-------------");
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("err-------------");
    console.log(err);
  });

const mgPort = process.env.MGSPORT || 5001;
const mgAppServer = mgApp.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
