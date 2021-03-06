const { redisClient } = require("../dbsSetup");

function formatDate(time) {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  // var newTime = hour + ":" + min + ":" + sec;
  var newTime =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return newTime;
}

exports.enterHandler = function (roomId, data, role) {
  console.log("socket on enter-----------------------");
  console.log(data);
  console.log(roomId);
  console.log(role);
  //获得当前东八区的时间，并赋值给 now
  let timeZone = 8;
  let offset_GMT = new Date().getTimezoneOffset();
  var nowDate = new Date().getTime();
  var now = new Date(
    nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
  );
  // formatDate(now)
  console.log(formatDate(now));
  switch (role) {
    case "teacher":
      console.log("老师进入聊天室：");
      console.log(data);
      // const { studentId, studentName } = data;
      const tData = {
        studentId: data.studentId,
        studentName: data.studentName,
        role,
        enterTime: formatDate(now),
      };
      console.log(tData);
      if (data.studentId && data.studentName) {
        redisClient.hset(roomId, data.studentId, JSON.stringify(tData));
      }
      break;
    case "student":
      console.log("学生进入聊天室：");
      const { studentId, studentName } = data;
      const sData = {
        studentId: data.studentId,
        studentName: data.studentName,
        role,
        enterTime: formatDate(now),
      };
      if (studentId && studentName) {
        redisClient.hset(roomId, studentId, JSON.stringify(sData));
      }
      break;
    default:
      break;
  }

  redisClient.hgetall(roomId, (err, data) => {
    console.log(data);
  });
};

exports.leaveHandler = function (roomId, data) {
  console.log("删除学生从聊天室：");
  console.log(data);
  const { studentId } = data;
  console.log("学生ID：" + studentId);
  if (studentId) {
    redisClient.hdel(roomId, studentId);
  }
  redisClient.hgetall(roomId, (err, data) => {
    console.log(data);
  });
};

exports.getMemberListInLesson = function (req, res, next) {
  let roomId = req.params.lesson_id;
  redisClient.hgetall(roomId, (err, data) => {
    if (err) {
      console.error(err);
      res.send({ status: false, msg: "get online list fail" });
    }
    data = data || {};
    res.send({ status: true, data });
  });
};
exports.clearMembersOfLesson = function (req, res, next) {
  const channelId = req.params.lesson_id;
  // redisClient.hgetall(roomId).
  redisClient.hgetall(channelId, (err, data) => {
    if (err) {
      console.error(err);
      res.send({ status: false, msg: "get online list fail" });
    }
    // data = data || {};
    console.log(data);

    if (data != null || data != undefined) {
      const result = Object.keys(data)
        .filter((item) => {
          return data[item].startsWith("{");
        })
        .map((key) => {
          let info = JSON.parse(data[key]);
          return info;
        });
      console.log(result);
      result.forEach((item) => {
        redisClient.hdel(channelId, item.studentId);
      });
    }
    redisClient.hgetall(channelId, (err, data) => {
      if (err) {
        console.error(err);
        res.send({ status: false, msg: "get online list fail" });
      }
      console.log("删除之后");
      console.log(data);
    });
    res.send({ status: "success" });
  });
};
