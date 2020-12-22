import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
const client = io(SOCKET_URL, {});

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
};

/**
 * 添加回调函数到不同活动
 *
 * @param {Socket} socket socket 连接实例
 * @param {String} roomId 房间号 等同于 lessonId
 */
function addListenersToScoket(socket, roomId) {
  socket.on([roomId], (eventData) => {
    const { actionType, data } = eventData;
    if (!listeners[actionType]) {
      console.error("unsupported action type");
      return null;
    }
    listeners[actionType](data);
  });
}

export function createInstance(that, callbacks) {
  const { lessonId } = that.$route.query;
  listeners = { ...listeners, ...callbacks };
  return new Promise((resolve, reject) => {
    client.on("connect", () => {
      console.info(`socket connection established, id is${client.id}`);
      addListenersToScoket(client, lessonId);
      resolve(client.id);
    });
    client.on("connect_error", () => reject());
  });
}

export function broadcastEvent(event) {
  const { roomId, data } = event;
  client.broadcast.emit(roomId, data);
}

export function sendEvent(event) {
  const { roomId, data } = event;
  client.emit(roomId, data);
}

export function publicEvent(data) {
  client.emit("public", data);
}
