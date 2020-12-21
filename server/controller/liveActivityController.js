const Activity = require("../models/liveActivityModel");
const catchAsync = require("./../utils/catchAsync");
const redis = require("redis");
const { redisClient } = require("../dbsSetup");
const AppError = require("./../utils/appError");

exports.createActivity = catchAsync(async (req, res, next) => {
  const payload = req.body;
  console.log(payload);
  const lessonId = payload.activityID;
  const lessonNumber = payload.activityNumber;
  const teacherName = payload.teacher;

  // redisClient.on("connect", function () {
  //   console.log("redis 连接上了");
  redisClient.hset(lessonId, lessonNumber, teacherName, redis.print);
  redisClient.hget(lessonId, lessonNumber, redis.print);
  console.log("connect");
  // });

  const newActivity = await Activity.create(req.body);

  res.status(201).json({
    status: "success",
    data: newActivity,
  });
});
