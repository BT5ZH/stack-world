const Course = require("../models/courseModel");
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
    resulrs: courses.length,
    data: {
      courses,
    },
  });
});

/**
 * 创建一门课程，首先根据课程号+学校名称判断数据库中是否已存在
 */
exports.createCourse = catchAsync(async (req, res) => {
  try {
    var course = await Course.findOne({course_id:req.body.course_id,org_name:req.body.org_name });
    if (course) {
      res.status(200).json({
        status: false,
        message: "course already exists"
      });
    } else {
      await Course.create(req.body);
      res.status(200).json({
        status: true,
        message: "success"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: err });
  }
});

/**
 * 批量添加课程
 */
exports.batchAddCourses = catchAsync(async (req, res) => {
  try {
    var courses = req.body.courses;
    await Course.insertMany(courses, { ordered: false });
    res.status(200).json({
      status: true
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: err });
  }
});
// 传id删除
exports.deleteOneCourse = catchAsync(async (req, res) => {
  try {
    var del = await Course.deleteOne({ _id: req.params._id });
    if ((del.deletedCount = 1)) {
      res.status(200).json({
        status: true,
        message: "success"
      });
    } else {
      res.status(500).json({
        status: false,
        message: "false"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: err });
  }
});

/**
 * 传入参数为课程编号数组courses_id
 * 例"courses_id":["1","2"]
 */
exports.batchDeleteCourses = catchAsync(async (req, res) => {
  var ids = req.body.courses_id;
  console.log(ids);
  try {
    await Course.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      status: true,
      message: "success"
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: err });
  }
});

// 传id修改数据req(_id,想修改的数据)
exports.updateCourse = catchAsync(async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params._id, req.body);
    res.status(200).json({
      message: "success"
    });
  } catch (err) {
    res.status(404).json({
      err
    });
  }
});

//通过id获取数据
exports.getCourse = catchAsync(async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id);
    if (course) {
      res.status(200).json({
        status: true,
        course
      });
    } else {
      res.status(404).json({
        status: false,
        message: "not found"
      });
    }
  } catch (err) {
    res.status(404).json({
      err
    });
  }
});
//edit by Chaos on 12-15
exports.getCoursesBySubOrgName = catchAsync(async (req, res, next) => {
  const data = await course.find({ subOrg_name: req.body.subOrg_name });
  if (!data) {
    return next(new AppError("课程不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data
    }
  });
});
//edit by Chaos on 12-15
exports.getCoursesByMajorName = catchAsync(async (req, res, next) => {
  const data = await course.find({ major_name: req.body.major_name });
  if (!data) {
    return next(new AppError("课程不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data
    }
  });
});
