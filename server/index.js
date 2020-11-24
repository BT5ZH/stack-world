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
const io = require("socket.io")(mgApp);
io.on("connection", (socket) => {
  console.log("connect");
});
// MongoDB Client Setup
/*
const DB =
  "mongodb://btUser:btPass@mongodb:27017/stack-learning?authSource=admin";
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Cluster connection successful!------");
  })
  .catch((err) => {
    console.error("DB Cluster connection err------");
    console.log(err);
  });
*/

const Altas = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(Altas, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Altas Cluster connection successful!");
  })
  .catch((err) => {
    console.error("Altas Cluster connection err");
    console.log(err);
  });

const mgPort = process.env.MGSPORT || 5001;
const mgAppServer = mgApp.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
