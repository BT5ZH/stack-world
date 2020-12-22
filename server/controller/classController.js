const Class = require("../models/classModel");
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
  const query = Class.find(JSON.parse(queryString)).select("className subOrgs");
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

  const classEntity = await Class.findOne({_id:req.params.id})
  .populate({
    path: 'studentList',
    select: 'user_id name -_id'

  });
  //.populate('students','user_id name -_id');

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }

  //console.log(classEntity);
  res.status(200).json({
    status: "success",
    data: {
      classEntity,
    },
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
    return next(new AppError("该机构不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addStudents = catchAsync(async (req, res, next) => {
  const mStudents = req.body.students;

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
});

exports.deleteStudents = catchAsync(async (req, res, next) => {
  const multiStudents = req.body;
  const classEntity = await Class.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $pull: {
        students: { _id: { $in: multiStudents } },
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

  res.status(204).json({
    status: "success",
    data: classEntity,
  });
});

exports.getStudents = catchAsync(async (req, res, next) => {
  console.log("getStudents 进来啦");

  const classEntity = await Class.findById(req.params.id);

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  // validate students list null or length==0 TODO:

  console.log(classEntity);
  res.status(200).json({
    status: "success",
    data: {
      students: classEntity.students,
    },
  });
});

exports.addCurriculum = catchAsync(async (req, res, next) => {
  const mCurriculum = req.body.curriculum;

  const ClassEntity = await Class.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $addToSet: {
        curriculum: mCurriculum,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: ClassEntity.curriculum,
  });
});

exports.deleteMultipleCourseTimeTable = catchAsync(async (req, res, next) => {
  const multiCourses = req.body;
  const classEntity = await Class.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $pull: {
        curriculum: { _id: { $in: multiCourses } },
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

  res.status(204).json({
    status: "success",
    data: classEntity.curriculum,
  });
});

exports.getCurriculum = catchAsync(async (req, res, next) => {
  console.log("getCurriculum 进来啦");

  const classEntity = await Class.findById(req.params.id);

  if (!classEntity) {
    return next(new AppError("该班级不存在", 404));
  }
  // validate students list null or length==0 TODO:

  console.log(classEntity);
  res.status(200).json({
    status: "success",
    data: {
      curriculum: classEntity.curriculum,
    },
  });
});
//edit by Chaos on 12-15
exports.getClassesBySubOrgName = catchAsync(async (req, res, next) => {
  const data = await Class.find({ subOrg_name:req.body.subOrg_name});
  if (!data) {
    return next(new AppError("班级不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
//edit by Chaos on 12-15
exports.getClassesByMajorName = catchAsync(async (req, res, next) => {
  const data = await Class.find({ major_name:req.body.major_name});
  if (!data) {
    return next(new AppError("班级不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});