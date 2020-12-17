const Lesson = require("../models/lessonModel");
const Class = require("../models/classModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//author: Chaos 12-13 
exports.getAllLessons = catchAsync(async (req, res, next) => {
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
  // console.log(queryString);
  const query = Lesson.find(JSON.parse(queryString));
  // console.log(query);
  // EXECUTE QUERY
  const lessons = await query;
  // console.log(courses);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    resulrs: lessons.length,
    data: {
      lessons,
    },
  });
});

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



exports.getLessonsByTeacherID = catchAsync(async (req, res, next) => {
  const data = await Lesson.find({ teacher_id:req.body.teacher_id}).populate('teacher_id','user_id name -_id');
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
  const data = await Lesson.find({ course_id:req.body.course_id}).populate('course_id','name org_name -_id');
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
  try {
    const lessonObj = await Class.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "classes",
          as: "Lesson",
        },
      },
      {$match: { _id: req.body.class_id },},
     // {$match: { year: year },},
     // {$match: { semester: semester },},
      {
        $project: {
          _id: 0,
          class_name: 1,
          "Lesson._id": 1,
          "Lesson.course_id": 1,
        },
      },
    ]);
    //console.log("lessonObj="+lessonObj)
    //if(lessonObj[0].belongedToLesson[0]!=null){
      res.status(200).json({
        status: "success",
        data: {
          lessonObj
        },
      });
   // }
  } catch (err) { 
    return false;
  }
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
  // const data = await Depart.findOne({ class_id:req.body.class_id,course_id:req.body.course_id});
  // if (!data) {
  //   return next(new AppError("该课不存在", 404));
  // }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     data,
  //   },
  // });
});

exports.getLessonByTeacherIDandClassID = catchAsync(async (req, res, next) => {
  // const data = await Depart.findOne({ teacher_id:req.body.teacher_id,course_id:req.body.course_id});
  // if (!data) {
  //   return next(new AppError("该课不存在", 404));
  // }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     data,
  //   },
  // });
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




