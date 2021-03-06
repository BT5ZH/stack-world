const Activity = require("../models/liveActivityModel");
const catchAsync = require("./../utils/catchAsync");
const redis = require("redis");
const { redisClient } = require("../dbsSetup");
const AppError = require("./../utils/appError");
// 腾讯云直播信息加密包
const TLSSigAPIv2 = require("tls-sig-api-v2");

exports.createActivity = catchAsync(async (req, res, next) => {
  const payload = req.body;
  console.log(payload);
  const lessonId = payload.activity_id;
  const lessonNumber = payload.activity_index;
  const teacherName = payload.teacher_name;

  redisClient.hset(lessonId, lessonNumber, teacherName, redis.print);
  redisClient.hget(lessonId, lessonNumber, redis.print);
  console.log(req.body);
  console.log("connect+++++++");
  console.log(payload);

  const newActivity = await Activity.create(payload);
  res.status(201).json({
    status: "success",
    data: newActivity,
  });
});

exports.updateActivity = catchAsync(async (req, res, next) => {
  console.log("更新活动事件数据");
  console.log(req.params._id);
  console.log(req.body);
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params._id },
    { phases: req.body.phases }
  );

  // const organization = Organization.findById({_id: req.params.id});
  // if (!organization) {
  //   return next(new AppError("该机构不存在", 404));
  // }

  res.status(200).json({
    status: "success",
    activity,
  });
});

exports.saveActivityMessage = catchAsync(async (req, res, next) => {
  console.log(req.body.request);
  const activityId = req.params.activity_id;

  await Activity.updateMany({ _id: activityId }, req.body.request);
  res.status(200).json({
    status: "success",
  });
});

exports.saveActivity = catchAsync(async (req, res, next) => {
  const payload = req.body;
  console.log("connect+++++++");
  const activityId = payload.activity_id;
  console.log(payload);
  let dataIn = {};
  let flag = false;
  if (payload.hasOwnProperty("sign_data")) {
    dataIn.sign_data = payload.sign_data;
    flag = true;
  } else if (payload.hasOwnProperty("question_data")) {
    dataIn.question_data = payload.question_data;
    flag = true;
  } else if (payload.hasOwnProperty("race_data")) {
    dataIn.race_data = payload.race_data;
    flag = true;
  } else if (payload.hasOwnProperty("randomSign_data")) {
    dataIn.randomSign_data = payload.randomSign_data;
    flag = true;
  } else if (payload.hasOwnProperty("vote_data")) {
    dataIn.vote_data = payload.vote_data;
    flag = true;
  } else if (payload.hasOwnProperty("test_data")) {
    dataIn.test_data = payload.test_data;
    flag = true;
  } else if (payload.hasOwnProperty("file_data")) {
    dataIn.file_data = payload.file_data;
    flag = true;
  }

  if (flag == false) {
    return;
  }

  const resulttemp = await Activity.findOneAndUpdate(activityId, dataIn, {
    new: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.genUserSig = catchAsync(async (req, res, next) => {
  const appid = process.env.LIVE_APP_ID;
  const secret = process.env.LIVE_SECRET_KEY;
  const api = new TLSSigAPIv2.Api(appid, secret);
  const sig = api.genSig(req.body.user_id, 3600 * 24);
  res.send({ sdkAppId: appid, userSig: sig });
});
