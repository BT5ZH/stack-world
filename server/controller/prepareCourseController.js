const PrepareCourse = require("../models/prepareLessonModel");
const catchAsync = require("../utils/catchAsync");

/**
 * 根据teacher_id获取该教师所有的备课
 */
exports.getAllPrepareCourseByTeacherId = catchAsync(async (req, res) => {
  var teacher_id=req.param.teacher_id;
  try {
    const prepareCourses = await PrepareCourse.find({teacher_id:teacher_id})
    res.status(200).json({
      status: 'success',
      data: {
        prepareCourses
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err });
  }

});

/**
 * 新建一门备课（此时备课内容为空）
 * req中包括课程信息如course_id、name、备课教师信息teacher_id等
 */
exports.createOnePrepareCourse = catchAsync(async (req, res) => {
  var newPrepareCourseInfo = req.body;
  try {
    var course = await PrepareCourse.find(
      { lesson_id: newPrepareCourseInfo.course_id,
        teacher_id: newPrepareCourseInfo.teacher_id }
    );
    if (course.length != 0) {
      res.status(200).json({
        status: "fail",
        message: "the course is exist"
      });
    } else {
      var pc = await PrepareCourse.create(newPrepareCourseInfo);
      res.status(200).json({
        status: "success",
        courseInfo: pc,
        msg: "success create a new prepareCourse"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});

/**
 * 根据teacher_id和course_id删除一门备课
 */
exports.deleteOnePrepareCourse = catchAsync(async (req, res) => {
  var courseInfo = req.body;
  try {
    var delCourseInfo = await PrepareCourse.deleteOne({course_id:courseInfo.course_id,teacher_id:courseInfo.teacher_id})
    if (delCourseInfo.deletedCount != 0) {
      res.status(200).json({
        status: "success",
        message: "success delete prepareCourse"
      });
    } else {
      res.status(200).json({
        status: "fail",
        msg: "fail delete prepareCourse"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});

/**
 * 为某一门课添加新课时备课
 * req中包括课程信息如course_id、备课教师信息teacher_id、课时信息lesson_index（课时的序号）lesson_name
 */
exports.addNewLesson = catchAsync(async (req, res) => {
  var newLessonInfo = req.body;
  try {
    var course = await PrepareCourse.findOne({course_id:newLessonInfo.course_id,teacher_id:newLessonInfo.teacher_id});
    var old_class = course.one_class

    var lesson = await PrepareCourse.updateOne(
      { courseId: newPrepareCourseInfo.courseId,teacherId: newPrepareCourseInfo.teacherId },{oneClass:newClass}
    );
    if (course.length != 0) {
      res.status(200).json({
        status: "fail",
        message: "the course is exist"
      });
    } else {
      var pc = await PrepareCourse.create(newPrepareCourseInfo);
      res.status(200).json({
        status: "success",
        courseInfo: pc,
        msg: "success create a new prepareCourse"
      });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
});
