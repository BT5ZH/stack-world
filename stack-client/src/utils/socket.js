import { io } from "socket.io-client";

const SOCKET_DEV_URL = "http://localhost:3050";
const SOCKET_PROD_URL =
  "http://stacksdocker-env-ysbhkejxhp.cn-northwest-1.eb.amazonaws.com.cn";
const client = io(SOCKET_PROD_URL, {});

let listeners = {};

/**
 * 添加回调函数到不同活动
 *
 * @param {Socket} socket socket 连接实例
 * @param {String} roomId 房间号 等同于 lessonId
 */
function addListenersToScoket(socket, roomId) {
  socket.on(roomId, (eventData) => {
    console.log("get channel data", eventData);
    const { actionType, data } = eventData;
    if (!listeners[actionType]) {
      console.error("unsupported action type");
      return null;
    }
    listeners[actionType](data);
  });
  if (listeners.public) {
    socket.on("public", (eventData) => {
      console.log(eventData);
      listeners.public && listeners.public(eventData);
    });
  }
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
