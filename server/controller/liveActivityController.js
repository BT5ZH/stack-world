const Activity = require("../models/liveActivityModel");
const catchAsync = require("./../utils/catchAsync");
const redis = require("redis");
const { redisClient } = require("../dbsSetup");
const AppError = require("./../utils/appError");

exports.createActivity = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    (match) => `$${match}`
  );

  const payload = req.body;
  console.log(payload);
  const lessonId = payload.activityID;
  const lessonNumber = payload.activityNumber;
  const teacherName = payload.teacher;

  redisClient.hset(lessonId, lessonNumber, teacherName, redis.print);
  redisClient.hget(lessonId, lessonNumber, redis.print);
  console.log("connect");

  // let query = { /* query */ };
  // let update = {expire: new Date()};
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let data = await Activity.findOneAndUpdate(
    JSON.parse(queryString),
    payload,
    options
  );

  // const newActivity = await Activity.create(req.body);

  res.status(200).json({
    status: "success",
    data,
  });
});
