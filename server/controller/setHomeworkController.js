const SetHomework = require("../models/setHomeworkModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllSetHomework = catchAsync(async (req, res, next) => {
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

  const query = SetHomework.find(JSON.parse(queryString));
  //.select("_id lesson_id number_of_time content ");

  const setHomework = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    resulrs: setHomework.length,
    data: {
      setHomework,
    },
  });
});

exports.createSetHomewrok = catchAsync(async (req, res, next) => {
  const oldHomework = await SetHomework.findOne({
    lesson_id: req.body.lesson_id,
    number_of_time: req.body.number_of_time,
  });
  if (!oldHomework) {
    const newSetHomewrok = await SetHomework.create(req.body);
    if (!newSetHomewrok) {
      return next(new AppError("作业创建失败", 500));
    }
    res.status(201).json({
      status: "success",
      data: newSetHomewrok,
    });
  } else {
    return next(new AppError("本节课作业布置已经存在", 500));
  }
});

exports.getSetHomework = catchAsync(async (req, res, next) => {
  const Homework = await SetHomework.findById(req.params._id).populate({
    path: "lesson_id",
    select: ["course_id", "-_id"]
    //populate: { path: "course_id", select: ["name", "-_id"] },
  });

  if (!Homework) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Homework,
    },
  });
});

exports.updateSetHomework = catchAsync(async (req, res, next) => {
  const setHomework = await SetHomework.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!setHomework) {
    return next(new AppError("该作业布置不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      setHomework,
    },
  });
});

exports.deleteSetHomework = catchAsync(async (req, res, next) => {
  const setHomework = await SetHomework.findByIdAndDelete(req.params.id);

  if (!setHomework) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
