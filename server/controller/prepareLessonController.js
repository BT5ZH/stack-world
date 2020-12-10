const PrepareLesson = require("../models/PrepareLessonModel");
const catchAsync = require("../utils/catchAsync");

/**
 * 根据教师Id获取该教师所有的备课
 */
// exports.getAllPrepareLessonByTeacherId = catchAsync(async (req, res) => {
//   var teacherId=req.param.teacherId;
//   try {
//     const PrepareLessons = await PrepareLesson.find(PrepareLesson)

//     res.status(200).json({
//       status: 'success',
//       data: {
//         PC,
//         msg:"hahha"
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ status: 'fail', message: err });
//   }

// });

/**
 * 新建一门备课（此时备课内容为空）
 * req中包括课程信息如courseId、courseName、备课教师信息TeacherId等
 */
exports.createOnePrepareLesson = catchAsync(async (req, res) => {
  var newPrepareLessonInfo = req.body;
  try {
    var course = await PrepareLesson.find(
      { courseId: newPrepareLessonInfo.courseId,teacherId: newPrepareLessonInfo.teacherId }
    );
    if (course.length != 0) {
      res.status(200).json({
        status: "fail",
        message: "the course is exist"
      });
    } else {
      var pc = await PrepareLesson.create(newPrepareLessonInfo);
      res.status(200).json({
        status: "success",
        courseInfo: pc,
        msg: "success create a new PrepareLesson"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});

/**
 * 根据teacherId和courseId删除一门备课
 */
exports.deleteOnePrepareLesson = catchAsync(async (req, res) => {
  var courseInfo = req.body;
  try {
    var delCourseInfo = await PrepareLesson.deleteOne({courseId:courseInfo.courseId,teacherId:courseInfo.teacherId})
    if (delCourseInfo.deletedCount != 0) {
      res.status(200).json({
        status: "success",
        message: "success delete PrepareLesson"
      });
    } else {
      res.status(200).json({
        status: "fail",
        msg: "fail delete PrepareLesson"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});

/**
 * 为某一门课添加新课时备课
 * req中包括课程信息如courseId、备课教师信息TeacherId、课时信息lessonIndex（课时的序号）lessonName
 */
exports.addNewLesson = catchAsync(async (req, res) => {
  var newLessonInfo = req.body;
  try {
    var course = await PrepareLesson.findOne({courseId:newLessonInfo.courseId,teacherId:newLessonInfo.teacherId});
    
    var oldClass = course.oneClass
    var lesson = await PrepareLesson.updateOne(
      { courseId: newPrepareLessonInfo.courseId,teacherId: newPrepareLessonInfo.teacherId },{oneClass:newClass}
    );
    if (course.length != 0) {
      res.status(200).json({
        status: "fail",
        message: "the course is exist"
      });
    } else {
      var pc = await PrepareLesson.create(newPrepareLessonInfo);
      res.status(200).json({
        status: "success",
        courseInfo: pc,
        msg: "success create a new PrepareLesson"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});
