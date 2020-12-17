import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3050";
const options = {};
let socket = null;
const client = io(SOCKET_URL, options);
const listeners = {
  // 投票
  vote: () => {},
  // 聊天室
  chat: () => {},
  // 随堂测验
  test: () => {},
  // 签到
  sign: () => {},
  // 随堂提问
  quiz: () => {},
  // 随机抽人
  pick: () => {},
  // 文件下发
  file: () => {},
  // 调查问卷 (questionnaire)
  ques: () => {},
};

function addListenersToScoket(socket) {
  for (item in listeners) {
    socket.on(item, listeners[item]);
  }
}

// TODO socket.io 是否有断线重连机制
function initSocketConnection() {
  return new Promise((resolve, reject) => {
    client.on("connect", (sk) => {
      socket = sk;
      console.log(`socket connection established, id is ${socket.id}`);
      addListenersToScoket(socket);
      resolve();
    });
    client.on("connect_error", () => reject());
  });
}

function createInstance(that, callbacks) {
  console.log(that);
  console.log(callbacks);
  if (!socket) initSocketConnection();
}

function sendEvent(event) {
  socket.emit(event.type, event.data);
}
