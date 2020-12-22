const PrepareLesson = require("../models/prepareLessonModel");
const catchAsync = require("../utils/catchAsync");

/**
 * 根据teacher_id获取该教师所有的备课
 */
exports.getAllPrepareLessonByTeacherId = catchAsync(async (req, res) => {
  var teacher_id = req.param.teacher_id;
  try {
    const prepareLessons = await PrepareLesson.find({ teacher_id: teacher_id });
    res.status(200).json({
      status: true,
      data: {
        prepareLessons
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});

/**
 * 根据teacher_id和course_id删除一门备课
 */
exports.deleteOnePrepareLesson = catchAsync(async (req, res) => {
  var lessonInfo = req.body;
  try {
    var delLessonInfo = await PrepareLesson.deleteOne({
      lesson_id: lessonInfo.lesson_id,
      teacher_id: lessonInfo.teacher_id
    });
    if (delLessonInfo.deletedCount != 0) {
      res.status(200).json({
        status: true,
        message: "success delete PrepareLesson"
      });
    } else {
      res.status(200).json({
        status: false,
        message: "fail delete PrepareLesson"
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});

/**
 *获取某老师某门课的备课信息
 *需传入参数（{teacher_id,lesson_id}）
 */
exports.getOnePrepareLesson = catchAsync(async (req, res) => {
  var lessonInfo = req.body;
  var teacher_id = lessonInfo.teacher_id;
  var lesson_id = lessonInfo.lesson_id;
  try {
    var lesson = await PrepareLesson.findOne({
      lesson_id: lesson_id,
      teacher_id: teacher_id
    });
    res.status(200).json({
      status: true,
      message: lesson
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});

/**
 * 为某一门课添加新课时备课
 * req中包括课程信息如lesson_id、备课教师信息teacher_id、课时信息section_index（课时的序号从1开始）section_name
 */
exports.addNewSection = catchAsync(async (req, res) => {
  var newLessonInfo = req.body;
  var lesson_id = newLessonInfo.lesson_id;
  var teacher_id = newLessonInfo.teacher_id;
  var section_index = newLessonInfo.section_index;
  var section_name = newLessonInfo.section_name;
  var new_section = {
    name: section_name,
    PPT: "",
    duration: 0,
    description: "",
    nodes: []
  };
  try {
    var lesson = await PrepareLesson.findOne({
      lesson_id: lesson_id,
      teacher_id: teacher_id
    });
    if (lesson == null) {
      var new_lesson = await PrepareLesson.create({
        lesson_id: lesson_id,
        teacher_id: teacher_id,
        one_class: [new_section]
      });
      res.status(200).json({ status: true, message: new_lesson });
    } else {
      if (section_index > lesson.one_class.length) {
        lesson.one_class.push(new_section);
      } else {
        lesson.one_class.splice(section_index - 1, 0, new_section);
      }
      lesson.save();
      res.status(200).json({ status: true, message: lesson });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});

/**
 * 将一门课的某一课时备课删除
 * req中包括课程信息如lesson_id、备课教师信息teacher_id、课时信息section_index（课时的序号从1开始）
 */
exports.deleteSection = catchAsync(async (req, res) => {
  var newLessonInfo = req.body;
  var lesson_id = newLessonInfo.lesson_id;
  var teacher_id = newLessonInfo.teacher_id;
  var section_index = newLessonInfo.section_index;

  try {
    var lesson = await PrepareLesson.findOne({
      lesson_id: lesson_id,
      teacher_id: teacher_id
    });
    lesson.one_class.splice(section_index - 1, 1);
    //此处还没考虑是否要删除相应的附件
    lesson.save();
    res.status(200).json({ status: true, message: lesson });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});
/**
 * 修改备课的课时名称(section_name)
 * 需要传入的参数：{lesson_id,teacher_id,section_index(从1开始),section_name}
 */
exports.updateSectionName = catchAsync(async (req, res) => {
  var newLessonInfo = req.body;
  var lesson_id = newLessonInfo.lesson_id;
  var teacher_id = newLessonInfo.teacher_id;
  var section_index = newLessonInfo.section_index;
  var section_name = newLessonInfo.section_name;
  try {
    var lesson = await PrepareLesson.findOne({
      lesson_id: lesson_id,
      teacher_id: teacher_id
    });
    lesson.one_class[section_index - 1].name = section_name;
    lesson.save();
    res.status(200).json({ status: true, message: lesson });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: err });
  }
});
exports.getAllPrepareLessons = catchAsync(async (req, res, next) => {
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
  const query = PrepareLesson.find(JSON.parse(queryString));
  // console.log(query);
  // EXECUTE QUERY
  const prepareLessons = await query;
  // console.log(courses);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    resulrs: prepareLessons.length,
    data: {
      prepareLessons,
    },
  });
});

/***
 * 
 */
exports.updateOnePrepareLesson = catchAsync(async (req,res)=>{

})


///////////////////////////////////////////////////
//以下代码暂时不用
///////////////////////////////////////////////////
/**
 * 新建一门备课（此时备课内容为空）
 * req中包括课程信息如lesson_id、备课教师信息teacher_id等
 */
// exports.createOnePrepareLesson = catchAsync(async (req, res) => {
//   var newPrepareLessonInfo = req.body;
//   try {
//     var lessons = await PrepareLesson.find({
//       lesson_id: newPrepareLessonInfo.lesson_id,
//       teacher_id: newPrepareLessonInfo.teacher_id
//     });
//     console.log("lessons",lessons)
//     if (lessons.length != 0) {
//       res.status(200).json({
//         status: "fail",
//         message: "the lesson is exist"
//       });
//     } else {
//       var pl = await PrepareLesson.create(newPrepareLessonInfo);
//       res.status(200).json({
//         status: "success",
//         lessonInfo: pl,
//         msg: "success create a new PrepareLesson"
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ status: "fail", message: err });
//   }
// });
