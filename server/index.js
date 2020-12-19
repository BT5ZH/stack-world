// const keys = require("./keys");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// Mongodb Setup
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

// Server Setup
const mgPort = process.env.MGSPORT || 5001;
const server = require("http").createServer(app);
const options = {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
  },
};

// app.use(
//   cors({
//     origin: ["http://localhost:8080"],
//     methods: ["GET", "HEAD", "OPTIONS", "POST"],
//   })
// );

const io = require("socket.io")(server, options);
// io.set("transports", [
//   "websocket",
//   "xhr-polling",
//   "jsonp-polling",
//   "htmlfile",
//   "flashsocket",
// ]);
// io.set("origins", "*:*");

// const nsp = io.of("/api");
io.on("connection", (socket) => {
  console.log("server connected");

  socket.on("message", (eventData) => {
    console.log(eventData);
    eventData.processed = Date.now();
    // send the message back to the client
    socket.emit("message", eventData);
  });

  socket.on("random", (eventData) => {
    console.log(eventData);
    // attach the current time
    eventData.processed = Date.now();
    // send the message back to the client
    socket.emit("random", eventData);
  });
});
server.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
