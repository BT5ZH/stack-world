const TimeTable = require("../models/timeTableModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// 可以站在学生、老师、课程的角度取课表

// 学生：用aggregate ，查询student_id等于已知id的课程

// 老师：查询teacher_id

// 课程：查询course_id
exports.getAllTimeTable = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryString);
  const query = TimeTable.find(JSON.parse(queryString));
  // .select(
  //   "roomNumber roomType campus building empty"
  // );
  //   console.log(query);
  // EXECUTE QUERY
  const timeTables = await query;
  console.log(timeTables);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: timeTables.length,
    data: {
      timeTables,
    },
  });
});

exports.createTimeTable = catchAsync(async (req, res, next) => {
  const data = await TimeTable.findOne({
    teacher_id: req.body.teacher_id,
    lesson_id: req.body.lesson_id,
  });
  if (!data) {
    const NewTimeTable = await TimeTable.create(req.body);
    res.status(201).json({
      status: "success",
      data: NewTimeTable,
    });
  } else {
    return next(new AppError("该课已存在", 500));
  }
});

exports.updateTimeTable = catchAsync(async (req, res, next) => {
  const timeTable = await TimeTable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!timeTable) {
    return next(new AppError("该课表不存在", 404));
  }
  res.status(200).json({
    status: "scccess",
    data: {
      timeTable,
    },
  });
});

exports.deleteTimeTable = catchAsync(async (req, res, next) => {
  const timeTable = await TimeTable.findByIdAndDelete(req.params.id);

  if (!timeTable) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(204).json({
    status: "scccess",
    data: null,
  });
});

// teacher role selection
exports.getTeacherTables = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ teacher_id: req.body.teacher_id });

  if (!data) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

// course role selection
exports.getCourseTables = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ course_id: req.body.course_id });

  if (!data) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
