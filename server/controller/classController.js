const Class = require("../models/classModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllClasses = catchAsync(async (req, res, next) => {
  console.log("classController getAllClasses 进来啦");

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
  const query = Class.find(JSON.parse(queryString));
  //   console.log(query);
  // EXECUTE QUERY
  const classes = await query;
  console.log(classes);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: classes.length,
    data: {
      classes,
    },
  });
});

exports.createClass = catchAsync(async (req, res, next) => {
  const newClass = await Class.create(req.body);
  res.status(201).json({
    status: "success",
    data: newClass,
  });
});

exports.getClass = catchAsync(async (req, res, next) => {
  const classEntity = await Class.findOne({ _id: req.params.id })
    // .populate({
    //   path: "studentList",
    //   select: "user_id name phone _id",
    // });
    .populate("students", "user_id name phone _id");

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }

  console.log(classEntity);
  res.status(200).json({
    status: "success",
    data: {
      classEntity,
    },
  });
});

exports.getStudentsNotInOneClass = catchAsync(async (req, res) => {
  const studentss = await User.find({
    org_name: req.query.org_name,
    subOrg_name: req.query.subOrg_name,
    major_name: req.query.major_name,
    role: "student",
  }).select("_id user_id name");
  let students = [];
  let studentIds = [];
  for (let i = 0; i < studentss.length; i++) {
    studentIds.push(studentss[i]._id);
    students.push(studentss[i]);
  }

  const studentsInClass = await Class.findById(req.query.class_id).select(
    "students"
  );
  // console.log("students========");
  // console.log(studentss);
  if (
    studentsInClass.students.length > 0 ||
    studentsInClass.students.length != null
  ) {
    for (let i = 0; i < studentsInClass.students.length; i++) {
      let index = studentIds.indexOf(studentsInClass.students[i]);
      if (index > -1) {
        studentIds.splice(index, 1);
        students.splice(index, 1);
      }
    }
  }
  let result = students;
  res.status(200).json({
    status: "success",
    result,
  });
});

exports.updateClass = catchAsync(async (req, res, next) => {
  const classEntity = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      classEntity,
    },
  });
});

exports.deleteClass = catchAsync(async (req, res, next) => {
  const classEntity = await Class.findByIdAndDelete(req.params.id);

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  const updatedStudent = await User.updateMany(
    { _id: { $in: classEntity.students } },
    {
      $pull: {
        class_id: req.params.id,
      },
    }
  );

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addStudents = catchAsync(async (req, res, next) => {
  console.log("添加学生方法2");
  const mStudents = req.body.students;
  console.log(mStudents);
  const newStudents = await Class.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $addToSet: {
        students: mStudents,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: newStudents,
  });
});
/*
exports.updateStudents = catchAsync(async (req, res, next) => {
  const leftStudents = req.body.students;
  const classEntity = await Class.find({ _id: req.params.id });
  classEntity.forEach((item) => {
    leftStudents.forEach((stu, i) => {
      item.students.forEach((arr, index) => {
        console.log(arr._id + "%%%%%%%" + stu._id);
        console.log(arr._id == stu._id);
        if (arr._id == stu._id) {
          arr.studentID = stu.studentID;
          arr.studentName = stu.studentName;
          arr.remark = stu.remark;
        }
      });
    });
  });

  console.log(classEntity);
  const result = await Class.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        students: classEntity[0].students,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!result) {
    return next(new AppError("更新班级学生列表信息出错", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      students: result.students,
    },
  });
});*/

//edit by chaos
exports.updateStudents = catchAsync(async (req, res, next) => {
  console.log("添加学生方法1");

  const newStudents = req.body.students;
  const classEntity = await Class.findOneAndUpdate(
    {
      _id: req.body.class_id,
    },
    {
      $addToSet: {
        students: newStudents, //check the item which is in the newStudents and not in the students
      }, //and add it into students
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }

  const updatedStudent = await User.updateMany(
    { _id: { $in: newStudents } },
    {
      $push: {
        class_id: req.body.class_id,
      },
    }
  );
  console.log(updatedStudent);

  res.status(200).json({
    status: "success",
  });
});

exports.deleteStudents = catchAsync(async (req, res, next) => {
  console.log("---req---");
  console.log(req.body);
  const multiStudents = req.body.students;
  const classEntity = await Class.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $pull: {
        students: { $in: multiStudents },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  const updatedStudent = await User.updateMany(
    { _id: { $in: multiStudents } },
    {
      $pull: {
        class_id: req.params.id,
      },
    }
  );
  res.status(204).json({
    status: "success",
  });
});

exports.getStudents = catchAsync(async (req, res, next) => {
  const classEntity = await Class.findById(req.params.id);

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  // validate students list null or length==0 TODO:

  // console.log(classEntity);
  res.status(200).json({
    status: "success",
    data: {
      students: classEntity.students,
    },
  });
});

// exports.addCurriculum = catchAsync(async (req, res, next) => {
//   const mCurriculum = req.body.curriculum;

//   const ClassEntity = await Class.findByIdAndUpdate(
//     {
//       _id: req.params.id,
//     },
//     {
//       $addToSet: {
//         curriculum: mCurriculum,
//       },
//     },
//     {
//       new: true,
//       upsert: true,
//     }
//   );

//   res.status(201).json({
//     status: "success",
//     data: ClassEntity.curriculum,
//   });
// });

// exports.deleteMultipleCourseTimeTable = catchAsync(async (req, res, next) => {
//   const multiCourses = req.body;
//   const classEntity = await Class.findOneAndUpdate(
//     {
//       _id: req.params.id,
//     },
//     {
//       $pull: {
//         curriculum: { _id: { $in: multiCourses } },
//       },
//     },
//     {
//       new: true,
//       upsert: true,
//     }
//   );

//   if (!classEntity) {
//     return next(new AppError("该班级不存在", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: classEntity.curriculum,
//   });
// });

// exports.getCurriculum = catchAsync(async (req, res, next) => {
//   console.log("getCurriculum 进来啦");

//   const classEntity = await Class.findById(req.params.id);

//   if (!classEntity) {
//     return next(new AppError("该班级不存在", 404));
//   }
//   // validate students list null or length==0 TODO:

//   //console.log(classEntity);
//   res.status(200).json({
//     status: "success",
//     data: {
//       curriculum: classEntity.curriculum,
//     },
//   });
// });
//edit by Chaos on 12-15
exports.getClassesBySubOrgName = catchAsync(async (req, res, next) => {
  const data = await Class.find({ subOrg_name: req.body.subOrg_name });
  if (!data || data.length === 0) {
    return next(new AppError("班级不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});
//edit by Chaos on 12-15
exports.getClassesByMajorName = catchAsync(async (req, res, next) => {
  const data = await Class.find({ major_name: req.body.major_name });
  if (data.length === 0 || !data) {
    return next(new AppError("班级不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
//edit by gongheng 12-31
// 得到班级查找树的数据
exports.putSubOrgAndMajorIntoTree = catchAsync(async (req, res, next) => {
  const data = await Class.aggregate([
    { $match: { org_name: req.query.org_name } },
    {
      $group: {
        _id: "$subOrg_name",
        majors: { $addToSet: "$major_name" },
      },
    },
  ]);
  if (data.length === 0 || !data) {
    return next(new AppError("课程不存在", 500));
  }
  console.log(data);
  res.status(200).json({
    status: "success",
    data,
  });
});
// 按前端所给条件(学院，专业)获取数据
exports.get_fromcondition_Class = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  const classes = await Class.find(req.body);
  if (!classes) {
    return next(new AppError("班级不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      classes,
    },
  });
});
