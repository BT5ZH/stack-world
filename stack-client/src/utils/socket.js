import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3050";
const options = {};
let socket = null;
const client = io(SOCKET_URL, options);
let listeners = {
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
  //
  joinRoom: () => {},
};

function addListenersToScoket() {
  for (const item in listeners) {
    client.on(item, listeners[item]);
  }
}

// TODO socket.io 是否有断线重连机制
function initSocketConnection() {
  return new Promise((resolve, reject) => {
    client.on("connect", (sk) => {
      socket = sk;
      console.log(`socket connection established, id is ${client.id}`);
      console.log(listeners);
      addListenersToScoket();
      resolve();
    });
    client.on("connect_error", () => reject());
  });
}

export function createInstance(that, callbacks) {
  listeners = { ...listeners, ...callbacks };
  console.log(listeners);
  if (!socket) initSocketConnection();
}

export function sendEvent(event) {
  let data = { ...event.data, clientId: client.id };
  console.log(data);
  console.log(`socket connection established, id is ${client.id}`);
  client.emit(event.type, data);
}
