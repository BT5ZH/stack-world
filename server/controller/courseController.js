const Course = require("../models/courseModel");
const Class = require("../models/classModel");
const User = require("./../models/userModel");
const Lesson = require("../models/lessonModel");      
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllCourses = catchAsync(async (req, res) => {
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
  const query = Course.find(JSON.parse(queryString));
  // console.log(query);
  // EXECUTE QUERY
  const courses = await query;
  // console.log(courses);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: courses.length,

    courses,
  });
});

/**
 * 创建一门课程，首先根据课程号+学校名称判断数据库中是否已存在
 */
exports.createCourse = catchAsync(async (req, res) => {
  const newCourse = await Course.create(req.body);
  res.status(200).json({
    status: true,
    message: "success",
    newCourse,
  });
});

exports.putSubOrgAndMajorIntoTree = catchAsync(async (req, res, next) => {
  const data = await Course.aggregate([
    { $match: { org_name: req.query.org_name } },
    {
      $group: {
        _id: "$subOrg_name",
        majors: { $addToSet: "$major_name" },
        course_number: { $sum: 1 },
      },
    },
  ]);
  const totalCourse = await Course.aggregate([
    { $match: { org_name: req.query.org_name } },
    {
      $group: {
        _id: null,
        course_number: { $sum: 1 },
      },
    },
  ]);
  const totalCourseNumber = totalCourse[0].course_number;
  if (data === [] || data === null) {
    return next(new AppError("课程不存在", 500));
  }

  res.status(200).json({
    status: "success",
    data,
    totalCourseNumber,
  });
});

/**
 * 批量添加课程
 */
exports.batchAddCourses = catchAsync(async (req, res, next) => {
  const courses = req.body;
  console.log(courses);
  if (!courses || courses.length == 0) {
    return next(new AppError("用户列表为空或无数据", 404));
  }
  const result = await Course.insertMany(courses);
  res.status(201).json({
    status: "success",
    courses,
  });
});
// 传id删除
exports.deleteOneCourse = catchAsync(async (req, res) => {
  // try {
  //   var del = await Course.deleteOne({ _id: req.params._id });
  //   if ((del.deletedCount = 1)) {
  //     res.status(200).json({
  //       status: true,
  //       message: "success",
  //     });
  //   } else {
  //     res.status(500).json({
  //       status: false,
  //       message: "false",
  //     });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.status(404).json({ status: false, message: err });
  // }

  const result = await Lesson.findOne({course_id:req.params._id})
  if(result){
    return next(new AppError("该课程已经被分配，不能删除", 500));
  }
  const data = await Course.findByIdAndDelete(req.params._id);

  if (!data) {
    return next(new AppError("该课程不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * 传入参数为课程编号数组courses_id
 * 例"courses_id":["1","2"]
 */
exports.batchDeleteCourses = catchAsync(async (req, res) => {
  var ids = req.body.courses_id;
  try {
    await Course.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});

// 传id修改数据req(_id,想修改的数据)
exports.updateCourse = catchAsync(async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params._id, req.body);
    res.status(200).json({
      status: true,
      message: "success",
    });

  } catch (err) {
    res.status(500).json({
      err,
    });
  }
  // const data = await Course.find()
  // for(let i = 0;i<data.length;i++)
  // {
  //   let ss=[]
  //   ss.push(data[i].semester)
  //   console.log(data[i])
  //   console.log("-------ss="+ss)
  //   await Course.updateOne({_id:data[i]._id},{$set:{semesters:ss}})
  // }
});

//通过id获取数据
exports.getCourse = catchAsync(async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id);
    if (course) {
      res.status(200).json({
        status: true,
        course,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});
//edit by Chaos on 12-15
exports.getCoursesBySubOrgName = catchAsync(async (req, res, next) => {
  const data = await Course.find({ subOrg_name: req.body.subOrg_name });
  if (!data) {
    return next(new AppError("课程不存在", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
//edit by Chaos on 12-15
exports.getCoursesByMajorName = catchAsync(async (req, res, next) => {
  const data = await Course.find({ major_name: req.body.major_name });
  if (!data) {
    return next(new AppError("课程不存在", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
exports.getCourseTeacherClassByOrg = catchAsync(async (req, res, next) => {
  const courses = await Course.find({
    org_name: req.body.org_name,
    subOrg_name: req.body.subOrg_name,
    major_name: req.body.major_name,
  })
  .select("course_id name semester")

  const teachers = await User.find({
    org_name: req.body.org_name,
    subOrg_name: req.body.subOrg_name,
    role: "teacher",
  })
  .select("user_id name");

  const classes = await Class.find({
    org_name: req.body.org_name,
    subOrg_name: req.body.subOrg_name,
  })
  .select("class_name");;

  const lessonss = await Course.find({
    org_name: req.body.org_name,
    subOrg_name: req.body.subOrg_name,
    major_name: req.body.major_name,
  }).select("course_id name")
  .populate({
    path: 'lessons',
    select: ['_id'],

    populate:{
      path: '_id',
      select: ['teacher_id', 'classes','year','semester'],

      populate: {
        path: 'teacher_id',
        select: ['name']
      },
    }
  })
  .populate({
    path: 'lessons',
    select: ['_id'],

    populate:{
      path: '_id',
      select: ['teacher_id', 'classes','year','semester'],
      populate: {
        path: 'classes',
        select: ['class_name']
      }
    }
  })
  let result=[]

  for(let i=0;i<lessonss.length;i++){
      if(lessonss[i].lessons.length!=0){
        
        result.push(lessonss[i])
      }
  }
   let lessons =result.map((item)=>{
    return{
        course_id:item.course_id,
        course_name:item.name,
        lessons:item.lessons.map(n=>{
          return{
            lesson_id:n._id._id,
            classes:n._id.classes,
            year:n._id.year,
            semester:n._id.semester,
            teacher_name:n._id.teacher_id.name
          }
        }),
       
    }
  })
  let lessonlist =lessons.map((item)=>{
    return{
        course_id:item.course_id,
        course_name:item.course_name,
        lesson_id:item.lessons[0].lesson_id,
        classes:item.lessons[0].classes,
        year:item.lessons[0].year,
        semester:item.lessons[0].semester,
        teacher_name:item.lessons[0].teacher_name
       
    }
  })
  res.status(200).json({
    status: "success",
    courses,
    teachers,
    classes,
    lessonlist
  });
});
