console.log("start to load socket js");
import { io } from "socket.io-client";
import studentListeners from "./studentSocket";
import teacherListeners from "./teacherSocket";

const SOCKET_DEV_URL = "http://localhost:3050";

const SOCKE_INNER_URL = "http://10.8.51.45:3050";

const SOCKET_PROD_URL_S = "https://test.w-click.cn";
const client = io(SOCKE_INNER_URL, {});

let listeners = {};

function sendIntercepter(channel, data) {
  console.log(`send message to channel ${channel} `, data);
}

function receiveIntercepter(channel, data) {
  console.log(`receive message from channel ${channel}`, data);
}

/**
 * 创建 socket instance 实例
 *
 * @export
 * @param {String} role student | teacher
 * @param {Object} that vue this
 * @param {String} lessonId 在某门课下的内容需要传此参数
 * @returns {Promise}
 */
export function createInstance(role, that, lessonId) {
  if (client.disconnected) {
    console.log("第一步");
    return new Promise((resolve, reject) => {
      client.on("connect", () => {
        console.info(`socket connection established, id is${client.id}`);
        loadListeners(role, that, lessonId);
        resolve(client.id);
      });
      client.on("connect_error", () => reject("conntected error"));
    });
  } else {
    console.log("第二步");
    return new Promise((resolve, reject) => {
      console.info(`socket connection already established, id is${client.id}`);
      loadListeners(role, that, lessonId);
      resolve(client.id);
    });
  }
}

/**
 * 加载监听函数
 *
 * @param {String} role student | teacher
 * @param {Object} that vue this
 * @param {String} lessonId 在某门课下的内容需要传此参数
 */
function loadListeners(role, that, lessonId) {
  let listeners = {};
  if (role === "student") {
    listeners = studentListeners(lessonId);
    console.log("第三步: 学生");
  } else if (role === "teacher") {
    listeners = teacherListeners(lessonId);
    console.log("第三步: 老师");
  } else {
    const msg =
      `[utils-socket] invalid role, ${role}` +
      " only support student and teacher";
    console.error(msg);
  }
  Object.keys(listeners).forEach((channel) => {
    console.log("第四步：channel" + channel);
    client.off(channel);
    client.on(channel, (eventData) => {
      receiveIntercepter(channel, eventData);
      const { actionType, data } = eventData;
      if (!listeners[channel][actionType]) {
        console.error("[utils-socket] unsupported action type" + actionType);
        return null;
      }
      listeners[channel][actionType](data, that, eventData);
    });
  });
}

/**
 * 发送消息
 *
 * @export
 * @param {String} channel joinRoom | public
 * @param {Object} data
 */
export function sendEvent(channel, data) {
  sendIntercepter(channel, data);
  client.emit(channel, data);
}

console.log("load socket js successfully");
