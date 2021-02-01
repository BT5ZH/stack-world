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

exports.createSetHomework = catchAsync(async (req, res, next) => {
  // const oldHomework = await SetHomework.findOne({
  //   lesson_id: req.body.lesson_id,
  //   number_of_time: req.body.number_of_time,
  // });
  // if (!oldHomework) {
    if(req.body.deadline===undefined || req.body.deadline===null){
      let timeZone = 8;
      let offset_GMT = new Date().getTimezoneOffset();
      var nowDate = new Date().getTime();
      var now = new Date(
           nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
     );
     req.body.deadline = now.setTime(now.getTime()+72*60*60*1000)

    }
    // else{
    //   let timeZone = 8;
    //   let offset_GMT = req.body.deadline.getTimezoneOffset();
    //   var nowDate = req.body.deadline.getTime();
    //   var now = new Date(
    //        nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
    //  );
    //  req.body.deadline = now.setTime(now.getTime())
    // }
    console.log("+++++++++++++++"+req.body.deadline)  
    const newSetHomework = await SetHomework.create(req.body);
    if (!newSetHomework) {
      return next(new AppError("作业创建失败", 500));
    }
    res.status(201).json({
      status: "success",
      newSetHomework,
    });
  // } else {
  //   return next(new AppError("本节课作业布置已经存在", 500));
  // }
});

exports.getSetHomeworkByID = catchAsync(async (req, res, next) => {
  const Homework = await SetHomework.findById(req.params.id)
  .populate({
    path: 'lesson_id',
    select: ['_id', 'course_id'],
    // model: 'College',
    populate: {
    path: 'course_id',
    select: ['_id', 'name']
    // model: 'Student'
    }
  })
  if (!Homework) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(200).json({
    status: "success",
      Homework,
  });
});
exports.getSetHomeworksByLessonID = catchAsync(async (req, res, next) => {
  console.log("-----"+req.body.lesson_id)
  let Homeworks = await SetHomework.find({lesson_id:req.body.lesson_id})
  .populate({
    path: 'lesson_id',
    select: ['_id', 'course_id'],
    // model: 'College',
    populate: {
    path: 'course_id',
    select: ['_id', 'name']
    // model: 'Student'
    }
  })
  .populate('resource_id','name')
  if (!Homeworks) {
    return next(new AppError("该作业布置不存在", 404));
  }
  Homeworks = Homeworks.map((item) => {
    let deadLine=item.deadline.toISOString().substring(0, 10)+" "+item.deadline.toISOString().substring(11, 16)
    
    return{
      _id:item._id,
      title:item.title,
      content:item.content,
      attachment:item.resource_id.name,
      resource_id:item.resource_id._id,
      number_of_time:item.number_of_time+1,
      task_type:item.task_type,
      deadline:deadLine,
      course_id:item.lesson_id.course_id.id,
      course_name:item.lesson_id.course_id.name
    }
  });
  res.status(200).json({
    status: "success",
      Homeworks,
  });
});
exports.getSetHomeworkByLessonIDandNumber = catchAsync(async (req, res, next) => {
  const Homework = await SetHomework.find({lesson_id:req.body.lesson_id,number_of_time:req.body.number_of_time})
  .populate({
    path: 'lesson_id',
    select: ['_id', 'course_id'],
    // model: 'College',
    populate: {
    path: 'course_id',
    select: ['_id', 'name']
    // model: 'Student'
    }
  })
  if (!Homework ||Homework.length===0) {
    return next(new AppError("该作业布置不存在", 404));
  }

  res.status(200).json({
    status: "success",
      Homework,
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
