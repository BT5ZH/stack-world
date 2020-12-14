const Lesson = require("../models/lessonModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//author: Chaos 12-13 
exports.createLesson = catchAsync(async (req, res, next) => {
  const data = await Lesson.findOne({ course_id:req.body.course_id,teacher_id:req.body.teacher_id});
  if(!data){
    const onelesson = await Lesson.create(req.body);
    res.status(201).json({
      status: "success",
      data: onelesson,
    });
  }else{
    return next(new AppError("该课已存在", 500));
  }
});

exports.getLesson = catchAsync(async (req, res, next) => {
  const data = await Lesson.findOne({ _id:req.params.lesson_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getAllLessons = catchAsync(async (req, res, next) => {
  const data = await Lesson.find();
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getLessonsByTeacherID = catchAsync(async (req, res, next) => {
  const data = await Lesson.find({ teacher_id:req.params.teacher_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getLessonsByCourseID = catchAsync(async (req, res, next) => {
  const data = await Lesson.find({ course_id:req.params.course_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getLessonsByClassID = catchAsync(async (req, res, next) => {
  const data = await Lesson.find({ class_id:req.params.class_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getLessonByCourseIDandTeacherID = catchAsync(async (req, res, next) => {
  const data = await Lesson.findOne({ teacher_id:req.body.teacher_id,course_id:req.body.course_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getLessonByCourseIDandClassID = catchAsync(async (req, res, next) => {
  const data = await Depart.findOne({ class_id:req.body.class_id,course_id:req.body.course_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getLessonByTeacherIDandClassID = catchAsync(async (req, res, next) => {
  const data = await Depart.findOne({ teacher_id:req.body.teacher_id,course_id:req.body.course_id});
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.deleteLesson = catchAsync(async (req, res, next) => {
  const data = await Lesson.findByIdAndDelete(req.params.lesson_id);

  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(204).json({
    status: "scccess",
    data: null,
  });
});

exports.updateLesson = catchAsync(async (req, res, next) => {
  const data = await Lesson.findByIdAndUpdate(req.params.lesson_id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(new AppError("该课表不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data,
  });
});




