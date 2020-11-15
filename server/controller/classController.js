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
  console.log("getClass 进来啦");

  const classEntity = await Class.findById(req.params.id);

  if (!classEntity) {
    return next(new AppError("该课程不存在", 404));
  }

  console.log(classEntity);
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
    status: "scccess",
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
    status: "scccess",
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
  //   .forEach(

  // }
  //     function (myDoc) {
  //       console.log("%%%%%%");
  //     }
  //   );
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

    // classEntity.save(item);
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
    return next(new AppError("更新院系信息出错", 404));
  }
  res.status(200).json({
    status: "scccess",
    data: {
      students: result.students,
    },
  });
});
