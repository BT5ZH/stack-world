const Lesson = require("../models/lessonModel");
const PrepareLesson = require("../models/prepareLessonModel");
const Class = require("../models/classModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const TimeTable = require("../models/timeTableModel");

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
  // const data = await Lesson.findOne({
  //   course_id: req.body.course_id,
  //   teacher_id: req.body.teacher_id,
  // });
  // if (!data) {
    const onelesson = await Lesson.create(req.body);
    res.status(201).json({
      status: "success",
      data: onelesson,
    });
  // } else {
  //   return next(new AppError("该课已存在", 500));
  // }
});

exports.getOneLessonByID = catchAsync(async (req, res, next) => {
  //const data = await Lesson.findOne({ _id:req.params.lesson_id});
  //const data = await Lesson.findOne({ teacher_id:{$ne:null},course_id:{$ne:null},_id:req.params.lesson_id}).populate('course_id','name -_id').populate('teacher_id','user_id name -_id');
  const data = await Lesson.findOne({ _id: req.params.lesson_id })
    .populate("course_id", "name -_id")
    .populate("teacher_id", "user_id name -_id");

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
exports.getCourseInfoByLessonID = catchAsync(async (req, res, next) => {
  console.log(req.query.lesson_id );
   const data = await Lesson.findOne({ _id: req.query.lesson_id }).select("_id course_id")
    .populate("course_id", "name evaluation course_id credit total_study_hours course_type -_id")

  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
      data,

  });
});
exports.getLessonsByTeacherID = catchAsync(async (req, res, next) => {
  const fullInfo = await Lesson.find({ teacher_id: req.body.teacher_id })
  .populate(
    "teacher_id",
    "user_id name -_id"
  )
  .populate(
    "course_id",
    "total_study_hours name course_type evaluation credit subOrg_name major_name -_id"
  )
  .populate(
    "prepareLesson",
    "one_class -_id"
  )
  if (!fullInfo) {
    return next(new AppError("该课不存在", 404));
  }
  let abstractInfo=fullInfo.map((item)=>{
    let classlength=0
    if(item.prepareLesson.length>0)
        classlength=item.prepareLesson[0].one_class.length
        
    return{
        _id:item._id,
        cover:item.cover,
        lesson_name:item.course_id.name,
        total_study_hours:item.course_id.total_study_hours,
        course_type:item.course_id.course_type,
        credit:item.course_id.credit,
        subOrg_name:item.course_id.subOrg_name,
        major_name:item.course_id.major_name,
        prepareNumber:classlength,
    }
  })
  res.status(200).json({
    status: "success",
    abstractInfo,
    fullInfo
  });
});

exports.getLessonsByCourseID = catchAsync(async (req, res, next) => {
  const data = await Lesson.find({ course_id: req.body.course_id }).populate(
    "course_id",
    "name org_name -_id"
  );
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
  const data = await Lesson.find({
    classes: { $elemMatch: { $eq: req.body.class_id } },
  }).populate("course_id", "name -_id");
  //const data = await Lesson.find({ course_id:{$ne:null},classes:{$elemMatch:{$eq:req.body.class_id}}}).populate('course_id','name -_id');

  if (!data) {
    return next(new AppError("该课不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
  // try {
  //   const lessonObj = await Class.aggregate([
  //     {
  //       $lookup: {
  //         from: "lessons",
  //         localField: "_id",
  //         foreignField: "classes",
  //         as: "Lesson",
  //       },
  //     },
  //     {$match: { _id: req.body.class_id },},
  //    // {$match: { year: year },},
  //    // {$match: { semester: semester },},
  //     {
  //       $project: {
  //         _id: 0,
  //         class_name: 1,
  //         "Lesson._id": 1,
  //         "Lesson.course_id": 1,
  //       },
  //     },
  //   ]);
  //   //console.log("lessonObj="+lessonObj)
  //   //if(lessonObj[0].belongedToLesson[0]!=null){
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         lessonObj
  //       },
  //     });
  //  // }
  // } catch (err) {
  //   return false;
  // }
});

exports.getLessonByCourseIDandTeacherID = catchAsync(async (req, res, next) => {
  const data = await Lesson.findOne({
    teacher_id: req.body.teacher_id,
    course_id: req.body.course_id,
  });
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
  const result = await PrepareLesson.findOne({lesson_id:req.params.lesson_id})
  if(result){
    return next(new AppError("该课已经存在备课内容，不能删除", 500));
  }

  const data = await Lesson.findByIdAndDelete(req.params.lesson_id);
  
  if (!data) {
    return next(new AppError("该课不存在", 404));
  }
  await TimeTable.findOneAndDelete({lesson_id:req.params.lesson_id});
  res.status(204).json({
    status: "success",
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
