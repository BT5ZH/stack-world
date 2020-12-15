const Course = require("../models/courseModel");

exports.getAllCourses = async (req, res) => {
  try {
    course = await Course.find();
    res.status(200).json({
      status: true,
      course
    });
  } catch (err) {
    res.status(404).json({
      status: true,
      err
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    var course = await Course.findOne({ _id: req.body._id });
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
};

/**
 * 批量添加课程
 */
exports.batchAddCourses = async (req, res) => {
  try {
    var courses = req.body.courses;
    await Course.insertMany(courses,{ordered:false});
    res.status(200).json({
      status: true
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: err });
  }
};
// 传id删除
exports.deleteOneCourse = async (req, res) => {
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
};

/**
 * 传入参数为课程编号数组courses_id
 * 例"courses_id":["1","2"]
 */
exports.batchDeleteCourses = async (req, res) => {
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
};

// 传id修改数据req(_id,想修改的数据)
exports.updateCourse = async (req, res) => {
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
};

//通过id获取数据
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params._id);
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
<<<<<<< HEAD
}
exports.getCoursesBySubOrgName = catchAsync(async (req, res, next) => {
    const data = await course.find({ subOrg_name:req.body.subOrg_name});
    if (!data) {
      return next(new AppError("该课程不存在", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });

  exports.getCoursesByMajorName = catchAsync(async (req, res, next) => {
    const data = await course.find({ major_name:req.body.major_name});
    if (!data) {
      return next(new AppError("该课程不存在", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });
=======
  } catch (err) {
    res.status(409).json({
      err
    });
  }
};

// new： bool - 默认为false。返回修改后的数据。
// 　　upsert： bool - 默认为false。如果不存在则创建记录。
// 　　runValidators： 如果值为true，执行Validation验证。
// 　　setDefaultsOnInsert： 如果upsert选项为true，在新建时插入文档定义的默认值。
// 　　sort： 如果有多个查询条件，按顺序进行查询更新。
// 　　select： 设置数据的返回。
>>>>>>> 3e9e687f9d93679d5886791410e1cd076401f4e6
