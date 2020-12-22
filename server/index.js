// const keys = require("./keys");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const redis = require("redis");
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
// Redis Setup
const { redisClient } = require("./dbsSetup");

// const redisClient = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   retry_strategy: () => 1000,
// });
// const redisPublisher = redisClient.duplicate();
redisClient.on("connect", function () {
  redisClient.set("author", "Wilson", redis.print);
  redisClient.get("author", redis.print);
  console.log("connect");
});
// Server Setup
const mgPort = process.env.MGSPORT || 5001;
const server = require("http").createServer(app);
const options = {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
  },
};

const io = require("socket.io")(server, options);

// const nsp = io.of("/api");
const gameRooms = [];

// redisClient.hset("values", index, "Nothing yet");

io.on("connection", (socket) => {
  console.log("server connected,socketId: " + socket.id);

  socket.on("joinRoom", (data) => {
    console.log("joinRoom 进来啦");
    console.log(data.roomId);
    // res = {
    //   enter:"",
    //   vote:"",
    //   // “select” 选择 “judge” 判断
    //   ques:{
    //     type:"select",//
    //   },
    //   test:{},
    //   sign:"",
    //   randomPick:"",
    //   file:""
    // };

    const roomChannel = data.roomId;
    if (data.role == "teacher") {
      // 教师登录房间
      switch (data.actionType) {
        case "enter":
          socket.join(roomChannel);
          io.to(roomChannel).emit(res);
          break;
        case "vote":
          io.to(roomChannel).emit(res);
          break;
        case "ques":
          io.to(roomChannel).emit(res);
          break;
        case "test":
          io.to(roomChannel).emit(res);
          break;
        case "sign":
          io.to(roomChannel).emit(res);
          break;
        case "randomPick":
          io.to(roomChannel).emit(res);
          break;
        case "file":
          io.to(roomChannel).emit(res);
          break;
        default:
          break;
      }
    } else if (data.role == "student") {
      // 学生登录房间
      switch (data.actionType) {
        case "enter":
          socket.join(roomChannel);
          io.to(roomChannel).emit(res);
          break;
        case "answer":
          // socket.join(roomChannel);
          io.to(roomChannel).emit(res);
          break;
        default:
          break;
      }
    }

    //查找房间标志
    /*
    let roomFlag = false;
    redisClient.keys("*", function (err, keys) {
      if (err) return console.log(err);
      console.log("有多少老师正在上课: " + keys.length);
      for (let i = 0, len = keys.length; i < len; i++) {
        console.log(
          "keys[i]: " + keys[i] + "; roomChannel:" + roomChannel + ";"
        );
        console.log("keys[i] == roomChannel" + (keys[i] == roomChannel));
        if (keys[i] == roomChannel) {
          roomFlag = true;
          break;
        }
      }
      if (roomFlag) {
        // 找到房间
        console.log("进来" + roomChannel + "啦");
        socket.join(roomChannel);
        return socket.emit(roomChannel, data.activityType);
      } else {
        // 没有找到房间
        return socket.emit(
          "err",
          "ERROR, No Room named" + data.roomId + "不存在"
        );
      }
    });
    */
  });

  socket.on("sign", (eventData) => {
    console.log(eventData);
    eventData.processed = Date.now();
    // send the message back to the client
    socket.emit("sign", eventData);
  });
});
server.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
