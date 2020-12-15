const Course = require('../models/courseModel')

exports.get_all = async (req, res) => {
    try {
        course = await Course.find();
        res.status(200).json({
            status: true,
            course,
        })
    } catch (err) {
        res.status(404).json({
            status: true,
            err,
        })
    }
}

exports.create_course = async (req, res) => {
    try {
        var course = await Course.findOne({ _id: req.body._id })
        if (course) {
            res.status(200).json({
                message: "course already exists"
            })
        } else {
            Course.create(req.body)
            // const uu = await new User(req.body).save()
            res.status(200).json({
                message: "success"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(404).json({ status: false, message: err });
    }
}

// 传id删除
exports.del_course = async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.body._id })
        res.status(200).json({
            status: true,
            message: "success"
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({ status: false, message: err })
    }
}

// 传id修改数据req(_id,想修改的数据)
exports.update_course = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.body._id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            message: 'success'
        })
    } catch (err) {
        res.status(404).json({
            err
        })
    }
}

//通过id获取数据
exports.getcourse = async (req, res) => {
    try {
        console.log(req)
        const course = await Course.findById(req.query.id);
        if (course) {
            res.status(200).json({
                course,
            })
        } else {
            res.status(404).json({
                message: 'not found',
            })
        }
    } catch (err) {
        res.status(409).json({
            err
        })
    }
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