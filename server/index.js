// const keys = require("./keys");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const redis = require("redis");
const app = require("./app");
const authController = require("./controller/authController");

// Mongodb Setup
const Altas = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const InnerDB = process.env.DATABASE_SNNU.replace(
  "<password>",
  process.env.DATABASE_SNNU_PASSWORD
);
mongoose
  .connect(InnerDB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Altas Cluster connection successful!");
    // 检查超管是否存在，不存在则创建
    authController.initMongo();
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

const innerOptions = {
  cors: {
    origin: "http://10.8.51.45:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
  },
};

const prodOptionsS = {
  cors: {
    origin: "https://test.w-click.cn:8080",
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
  },
};

const io = require("socket.io")(server, innerOptions);
const socketOP = require("./utils/socket");
// const nsp = io.of("/api");
const gameRooms = [];

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
          socketOP.enterHandler(roomChannel, data.data, data.role);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "leave":
          console.error("收到了老师端发来离开房间的命令");
          socketOP.leaveHandler(roomChannel, data.data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "vote":
          console.log("收到了老师发送投票的命令");
          console.log(data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "ques":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "test":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "pick":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "ask":
          console.log("收到了老师发送提问的命令");
          console.log("收到了老师发送提问的命令" + roomChannel);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "sign":
          console.log("收到了老师发送签到的命令");
          console.log("收到了老师发送签到的命令" + roomChannel);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "randomSign":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "race":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "randomPick":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "file":
          console.log("收到了老师发送文件下发的命令");
          console.log(data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        default:
          break;
      }
    } else if (data.role == "student") {
      // 学生登录房间
      switch (data.actionType) {
        case "enter":
          socket.join(roomChannel);
          socketOP.enterHandler(roomChannel, data.data, data.role);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "leave":
          console.error("收到了学生端发来离开房间的命令");
          socketOP.leaveHandler(roomChannel, data.data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "sign":
          io.to(roomChannel).emit(roomChannel, data);
          break;
        case "randomSign":
          io.to(roomChannel).emit(roomChannel, data);
          break;
        case "pick":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "test":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "ask":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "vote":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "race":
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "file":
          console.log("收到了学生发送 关于文件下发的反馈");
          console.log(data);
          socket.to(roomChannel).emit(roomChannel, data);
          break;
        case "answer":
          io.to(roomChannel).emit(roomChannel, data);
          break;
        default:
          break;
      }
    }
  });
});
server.listen(mgPort, (err) => {
  console.log(`App running on port ${mgPort}...`);
});
