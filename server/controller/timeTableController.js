const TimeTable = require("../models/timeTableModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const Class = require("../models/classModel");
// 可以站在学生、老师、课程的角度取课表

// 学生：用aggregate ，查询student_id等于已知id的课程

// 老师：查询teacher_id

// 课程：查询course_id
exports.getAllTimeTable = catchAsync(async (req, res, next) => {
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
  const query = TimeTable.find(JSON.parse(queryString));
  // .select(
  //   "roomNumber roomType campus building empty"
  // );
  //   console.log(query);
  // EXECUTE QUERY
  const timeTables = await query;
  //console.log(timeTables);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: timeTables.length,
    data: {
      timeTables,
    },
  });
});

exports.createTimeTable = catchAsync(async (req, res, next) => {
  // const data = await TimeTable.findOne({
  //   teacher_id: req.body.teacher_id,
  //   lesson_id: req.body.lesson_id,
  // });
  // if (!data) {
  //   const NewTimeTable = await TimeTable.create(req.body);
  //   res.status(201).json({
  //     status: "success",
  //     data: NewTimeTable,
  //   });
  // } else {
  //   return next(new AppError("该课已存在", 500));
  // }
  
    const NewTimeTable = await TimeTable.create(req.body);
    if (!NewTimeTable) {
      return next(new AppError("新课表创建失败", 500));
    }
    res.status(201).json({
      status: "success",
      data: NewTimeTable,
    });
});

exports.updateTimeTable = catchAsync(async (req, res, next) => {
  const timeTable = await TimeTable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!timeTable) {
    return next(new AppError("该课表不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      timeTable,
    },
  });
});

exports.deleteTimeTable = catchAsync(async (req, res, next) => {
  const timeTable = await TimeTable.findByIdAndDelete(req.params.id);

  if (!timeTable) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getTimeTableFromTeacherID = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ teacher_id: req.body.teacher_id });

  if (!data|| data[0]== null) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getTimeTableFromCourseID = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ course_id: req.body.course_id });

  if (!data || data[0]== null) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
//////edit by Chaos on 12-15
//this function is used to get the class_id which the student_id belongs to.
async function belongedToWhichClass(student_id) {
  try {
    const classObj = await User.aggregate([
      {
        $lookup: {
          from: "classes",
          localField: "_id",
          foreignField: "students",
          as: "belongedToClass",
        },
      },
      {
        $match: { _id: student_id },
      },
      {
        $project: {
          //_id: 0,
          //branch_name: 1,
          "belongedToClass._id": 1,
          //"belongedToDepart.depart_name": 1,
        },
      },
    ]);

    return classObj;
  } catch (err) {
    return false;
  }
};
//this function is used to get the lesson_id which the class_id belongs to.
async function belongedToWhichLesson(class_id,year,semester) {
  try {
    const lessonObj = await Class.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "classes",
          as: "belongedToLesson",
        },
      },
      {$match: { _id: class_id },},
      {$match: { year: year },},
      {$match: { semester: semester },},
      {
        $project: {
          //_id: 0,
          //branch_name: 1,
          "belongedToLesson._id": 1,
          //"belongedToDepart.depart_name": 1,
        },
      },
    ]);

    return lessonObj;
  } catch (err) {
    return false;
  }
};
exports.getTimeTableFromStudentID = catchAsync(async (req, res, next) => {
  //---get all class_id which the student_id belongs to. Then push them into array classIdList one by one.
  const classObj = await belongedToWhichClass(req.body.student_id);
  if(classObj[0].belongedToClass[0]!=null){
    let len = classObj[0].belongedToClass.length;
    let classIdList = [];
    let lessonIdList = [];//save all the lesson_id which connected to the class that the student belongs to.
    for(let i=0; i<len ; i++){
      classIdList.push(classObj[0].belongedToClass[i]._id);
    }
  //----------------------------------------------------------------------------------------
  //---take class_id from classIdList one by one and get all lesson_id which the class_id belongs to. 
  //---Then push them into array lessonIdList one by one.
    for(let i=0; i<classIdList.length ; i++) {
        var lessonObj = await belongedToWhichLesson(classIdList[i],req.body.year,req.body.semester);
        if(lessonObj[0].belongedToLesson[0]!=null){
          let len = lessonObj[0].belongedToLesson.length;
          
          for(let j=0; j<len ; j++){
            lessonIdList.push(lessonObj[0].belongedToLesson[j]._id);
          }
        }
    }
    //---get doc from timeTableModel depending on the lessonIdList.
    let result=[]//save each lesson timetable data
    for(let i=0; i<lessonIdList.length ; i++) {
      const data = await TimeTable.findOne({ lesson_id: lessonIdList[i] });
      
      if (!data) {
        return next(new AppError("该课不存在", 404));
      }
      result.push(data)
    }
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  }
})