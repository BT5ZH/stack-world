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
const devOptions = {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
  },
};

const prodOptions = {
  cors: {
    origin:
      "http://stacksdocker-env-ysbhkejxhp.cn-northwest-1.eb.amazonaws.com.cn:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
  },
};

const io = require("socket.io")(server, devOptions);
const socketOP = require("./utils/socket");
// const nsp = io.of("/api");
const gameRooms = [];

// redisClient.hset("values", index, "Nothing yet");

io.on("connection", (socket) => {
  console.log("server connected,socketId: " + socket.id);
  socket.on("public", (data) => {
    const { lessonId, teacherId } = data;
    console.log("receive broadcast message：", lessonId, teacherId);
    socket.broadcast.emit("public", data);
  });

  socket.on("joinRoom", (data) => {
    const roomChannel = data.roomId;
    const { actionType, role } = data;
    console.log(`${role} ${actionType}`, data);

    if (data.role == "teacher") {
      // 教师登录房间
      switch (data.actionType) {
        case "enter":
          socket.join(roomChannel);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "vote":
          socket.to(roomChannel).emit(res);
          break;
        case "ques":
          socket.to(roomChannel).emit(res);
          break;
        case "test":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "sign":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "randomPick":
          socket.to(roomChannel).emit(res);
          break;
        case "file":
          socket.to(roomChannel).emit(res);
          break;
        default:
          break;
      }
    } else if (data.role == "student") {
      // 学生登录房间
      switch (data.actionType) {
        case "enter":
          socket.join(roomChannel);
          socketOP.enterHandler(roomChannel, data.data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "sign":
          io.to(roomChannel).emit(roomChannel, data);
          break;
        case "test":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "answer":
          io.to(roomChannel).emit(roomChannel, data);
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
});
server.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
