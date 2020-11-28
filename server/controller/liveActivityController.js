const Activity = require("../models/liveActivityModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createActivity = catchAsync(async (req, res, next) => {
  const newActivity = await Activity.create(req.body);
  res.status(201).json({
    status: "success",
    data: newActivity,
  });
});
