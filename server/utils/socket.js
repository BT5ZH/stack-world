const { redisClient } = require("../dbsSetup");

exports.enterHandler = function (roomId, data) {
  const { studentId, studentName } = data;
  if (studentId && studentName) {
    redisClient.hset(roomId, studentId, JSON.stringify(data));
  }
};

exports.leaveHandler = function (roomId, data) {
  const { studentId, studentName } = data;
  if (studentId && studentName && className) {
    redisClient.hdel(roomId, studentId);
  }
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
