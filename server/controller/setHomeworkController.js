const Resource = require("../models/resourceModel");
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
    // if( req.body.deadline==="2100-12-31 00:00" || req.body.deadline===undefined || req.body.deadline===null){
    //   let timeZone = 8;
    //   let offset_GMT = new Date().getTimezoneOffset();
    //   let nowDate = new Date().getTime();
    //   let now = new Date(nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000);
    //   req.body.deadline = now.setTime(now.getTime()+120*60*60*1000)

    // }
    // else{
    //   let endTime = new Date(Date.parse(req.body.deadline));
    //   console.log("+++++++++++++++"+req.body.deadline)  
    //   console.log("+++++++++++++++"+endTime)  
    //   let timeZone = 8;
    //   let offset_GMT = endTime.getTimezoneOffset();
    //   let nowDate = endTime.getTime();
    //   let now = new Date(
    //         nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
    //   );
    //   req.body.deadline = now//.setTime(now.getTime())
    //   console.log("+++++++++++++++"+req.body.deadline)  
    // }
    // let resource
    // if(req.body.resource_id!="not selected"){
    //    resource = await Resource.findById(req.body.resource_id).select(' url');
    //    if(!resource){
    //     return next(new AppError("作业创建失败,因为包含的资源不存在", 500));
    //   }
    //   //req.body.rsType = resource.rsType;
    //   req.body.attachment_url = resource.url;
    // }
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
  let data = await SetHomework.find({lesson_id:req.body.lesson_id})
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
  .populate('resource_id','name url rsType')
  if (!data) {
    return next(new AppError("该作业不存在", 404));
  }
  let Homeworks = data.map((item) => {
    //let deadLine=item.deadline.toISOString().substring(0, 10)+" "+item.deadline.toISOString().substring(11, 16)
    let resource_name
    let resource_id
    if(item.resource_id===undefined || item.resource_id===null || item.resource_id=== "not selected") {
      resource_name=" ";
      resource_id=" "
    }
    else {
      resource_name=item.resource_id.name
      resource_id=item.resource_id._id
    }
    return{
      _id:item._id,
      title:item.title,
      content:item.content,
      attachment:resource_name,
      resource_id:resource_id,
      number_of_time:item.number_of_time+1,
      task_type:item.task_type,
      deadline:item.deadline,
      course_id:item.lesson_id.course_id.id,
      course_name:item.lesson_id.course_id.name
    }
  });
  let homeworkList = data.map((item) => {
    let attachment_url=" "
    if(item.resource_id!=null){
      attachment_url = item.resource_id.url;
    }
    return{
        hid: item._id,
        lid: item.lesson_id._id,
        cid: item.lesson_id.course_id.id,
        isFinish:false,////
        resType:0,//配合前端展示需要的一个参数
        title: '第'+(item.number_of_time+1)+'次课作业:'+item.title,
        content: item.content,
        attachment_url: attachment_url,
        task_type:item.task_type,
        deadline:item.deadline,
    }
  });
  res.status(200).json({
    status: "success",
      Homeworks,homeworkList
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
