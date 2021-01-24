const SchoolYear = require("../models/schoolYearModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllSchoolYear = catchAsync(async (req, res) => {
  try {
    schoolYears = await SchoolYear.find();
    res.status(200).json({
      status: true,
      schoolYears
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      err
    });
  }
});
exports.getCurrentSchoolYear = catchAsync(async (req, res, next) => {
    const syInfo = await SchoolYear.findOne({ current: "t" });

    if (!syInfo) {
      return next(new AppError("无当前学年数据", 404));
    }

    res.status(200).json({
      status: "success",
      syInfo,
    });
});
/**
 * 添加学年学期
 * 传入的参数样例
 * {
	"year":"2020-2021",
	"semester":"第二学期",
	"weeks":"20",
	"start_time":"5615151515",
	"end_time":"5615145515"
}
 */
exports.addSchoolYear = catchAsync(async (req, res) => {
  var year = req.body.year;
  var semester = req.body.semester;
  console.log(req.body);
  try {
    var schoolYear = await SchoolYear.find({ year: year, semester: semester });
    console.log(schoolYear);
    if (schoolYear.length != 0) {
      res.status(200).json({
        status: false,
        message: "该学期已经存在"
      });
    } else {
      var schoolYear = await SchoolYear.create(req.body);
      res.status(200).json({
        status: true,
        message: "添加成功",
        schoolYear
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});

// 传id删除
exports.deleteSchoolYear = catchAsync(async (req, res) => {
  try {
    var del = await SchoolYear.deleteOne({ _id: req.query._id });
    if ((del.deletedCount = 1)) {
      res.status(200).json({
        status: true,
        message: "success"
      });
    } else {
      res.status(200).json({
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
 *传参形式
 {
  "_id":"1551515",
	"year":"2020-2021",
	"semester":"第二学期",
	"weeks":"20",
	"start_time":"5615151515"时间戳,
	"end_time":"5615145515"时间戳
}
 */
exports.updateSchoolYear = catchAsync(async (req, res) => {
  try {
    await SchoolYear.findByIdAndUpdate(req.body._id, req.body);
    res.status(200).json({
      status: true,
      message: "success"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      err
    });
  }
});
