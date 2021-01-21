const TimeTable = require("../models/timeTableModel");
const SchoolYear = require("../models/schoolYearModel")
const Lesson = require("../models/lessonModel");
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
exports.generateTimeTable = catchAsync(async (req, res, next) => {
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

  let NewTimeTable = await TimeTable.create(req.body);
  if (!NewTimeTable) {
    return next(new AppError("新课表创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    data: NewTimeTable,
  });
})
exports.createTimeTable = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.body.lesson_id).select("_id teacher_id course_id")
  if (!lesson) {
    return next(new AppError("该课程不存在", 404));
  }
  let NewTimeTable = await TimeTable.create({
    course_id: lesson.course_id,
    lesson_id: lesson._id,
    teacher_id: lesson.teacher_id,
    curriculum: req.body.curriculum
  })
  if (!NewTimeTable) {
    return next(new AppError("新课表创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    NewTimeTable,
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
  const data = await TimeTable.find({ teacher_id: req.body.teacher_id })
    .populate("course_id", "name -_id")
    .populate("teacher_id", "user_id name -_id")
    .populate("curriculum.class_id", "class_name -_id")
    .populate("curriculum.room_id", "room_number -_id");

  if (!data || data.length === 0) {
    return next(new AppError("该课表不存在", 404));
  }

  let result = []
  for (let i = 0; i < data.length; i++) {
    let oneLesson = await Lesson.findById(data[i].lesson_id)
    if (oneLesson.year === req.body.year && oneLesson.semester === Number(req.body.semester))
      result.push(data[i])
  }

  res.status(200).json({
    status: "success",
    data,//get all the timetable data of the teacher selected without regard to the year and sememser
    result,//according to the given year and semester, return the suitable timetable of the teacher selected
  });
});

exports.getTimeTableFromRoomID = catchAsync(async (req, res, next) => {
  // const data = await TimeTable.find({
  //   curriculum: { $elemMatch: { $eq: req.query.room_id } },
  // }).populate("course_id", "name -_id");

  const data = await TimeTable.aggregate([
    { $unwind: "$curriculum" },
    { $match: { "curriculum.room_id": req.query.room_id } },
    // {
    //   $lookup: {
    //     from: "rooms",
    //     localField: "curriculum.room_id",
    //     foreignField: "_id",
    //     as: "Room",
    //   },
    // },
    {
      $lookup: {
        from: "users",
        localField: "teacher_id",
        foreignField: "_id",
        as: "Teacher",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course_id",
        foreignField: "_id",
        as: "Course",
      },
    },
    {
      $project: {
        lesson_id: 1,
        "curriculum.date": 1,
        "curriculum.order": 1,
        "curriculum.odd_or_even": 1,
        "Course._id": 1,
        "Course.name": 1,
        //"Room.room_number": 1,
        "Teacher.name": 1,
        "Teacher.user_id": 1,
      },
    },
  ]);

  if (!data || data.length === 0) {
    return next(new AppError("该课表不存在", 404));
  }

  let temp = data.map((item) => {
    return {
      lessonID: item.lesson_id,
      date: item.curriculum.date,
      order: item.curriculum.order,
      odd_or_even: item.curriculum.odd_or_even,
      teacher_name: item.Teacher[0].name,
      teacher_number: item.Teacher[0].user_id,
      course_name: item.Course[0].name
    }
  })

  let result = []
  for (let i = 0; i < temp.length; i++) {
    let oneLesson = await Lesson.findById(temp[i].lessonID)
    if (oneLesson.year === req.query.year && oneLesson.semester === Number(req.query.semester))
      result.push(temp[i])
  }
  res.status(200).json({
    status: "success",
    temp, //the temp array saves all the timetable data of the room selected without regard to the year and sememser
    result,//according to the given year and semester, return the suitable timetable of the room selected
  });
});

exports.getTimeTableFromCourseID = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ course_id: req.body.course_id });

  if (!data || data.length === 0) {
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
          "belongedToClass._id": 1,
        },
      },
    ]);

    return classObj;
  } catch (err) {
    return false;
  }
}
//this function is used to get the lesson_id which the class_id belongs to.
async function belongedToWhichLesson(class_id) {
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
      { $match: { _id: class_id } },
    ]);

    return lessonObj;
  } catch (err) {
    return false;
  }
}
exports.getTimeTableFromStudentID = catchAsync(async (req, res, next) => {
  //---get all class_id which the student_id belongs to. Then push them into array classIdList one by one.
  let result = []; //save each lesson timetable data
  const classObj = await belongedToWhichClass(req.body.student_id);
  if (classObj[0].belongedToClass[0] != null) {
    let len = classObj[0].belongedToClass.length;
    let classIdList = [];
    let lessonIdList = []; //save all the lesson_id which connected to the class that the student belongs to.
    for (let i = 0; i < len; i++) {
      classIdList.push(classObj[0].belongedToClass[i]._id);
    }
    //----------------------------------------------------------------------------------------
    //---take class_id from classIdList one by one and get all lesson_id which the class_id belongs to.
    //---Then push them into array lessonIdList one by one.
    for (let i = 0; i < classIdList.length; i++) {
      var lessonObj = await belongedToWhichLesson(classIdList[i]);
      var lessonsOfOneClass = lessonObj[0].belongedToLesson;
      // console.log("lessonsOfOneClass",lessonsOfOneClass)
      for (var j = 0; j < lessonsOfOneClass.length; j++) {
        if (
          lessonsOfOneClass[j].year == req.body.year &&
          lessonsOfOneClass[j].semester == req.body.semester
        ) {
          lessonIdList.push(lessonsOfOneClass[j]._id);
        }
      }
    }

    for (let i = 0; i < lessonIdList.length; i++) {
      const data = await TimeTable.findOne({
        lesson_id: lessonIdList[i],
      })
        .populate("course_id", "name")
        .populate("teacher_id", "name")
        .populate({
          path: "curriculum.room_id",
          populate: { path: "building" },
        })
        .populate("curriculum.class_id", "class_name -_id");
      if (data) {
        result.push(data);
      }
    }
    if(result.length===0){
      return next(new AppError("课表不存在", 200));
    }
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } else {
    //the student have not in any class,so he isn't any lesson
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  }
});
exports.getTimeTableFromClassID = catchAsync(async (req, res, next) => {
  let result = []; 
      let lessonIdList = []; 
      let lessonObj = await belongedToWhichLesson(req.body.class_id);
      let lessonsOfOneClass = lessonObj[0].belongedToLesson;
      console.log("lessonsOfOneClass",lessonsOfOneClass)
      for (let j = 0; j < lessonsOfOneClass.length; j++) {
        if (
          lessonsOfOneClass[j].year == req.body.year &&
          lessonsOfOneClass[j].semester == req.body.semester
        ) {
          lessonIdList.push(lessonsOfOneClass[j]._id);
        }
      }

    for (let i = 0; i < lessonIdList.length; i++) {
      console.log("lessonIdList[i]====="+lessonIdList.length)
      console.log(lessonIdList[i])
      const data = await TimeTable.findOne({lesson_id: lessonIdList[i]})
      .populate("course_id", "name")
      .populate("teacher_id", "name")
      .populate({
          path: "curriculum.room_id",
          populate: { path: "building" },
      })
      .populate("curriculum.class_id", "class_name -_id");

      if (data) 
        result.push(data);
    }
    if(result.length===0){
      return next(new AppError("课表不存在", 200));
    }

    res.status(200).json({
      status: "success",
      result,
    });
});
exports.getTimeTableFromLessonID = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ lesson_id: req.body.lesson_id })
    //.populate("course_id", "name -_id")
    //.populate("teacher_id", "user_id name -_id")
    .populate("curriculum.class_id", "class_name _id")
    .populate("curriculum.room_id", "room_number campus_name building_name _id");

  if (!data || data.length === 0) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getLatestTimeTableofTeacher = catchAsync(async (req, res, next) => {
   //get school year information
   const syInfo = await SchoolYear.findOne({current: 't'});
   let year = syInfo.year
   let semester = syInfo.semester
   let semester_startTime = new Date(Date.parse(syInfo.start_time + " 00:00"));
   let semester_endTime = new Date(Date.parse(syInfo.end_time + " 23:59")); 
   let ct = syInfo.course_time
   let et=[]
   
  let now = new Date();
  let month = now.getMonth()
  let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  let today = week[now.getDay()]
  let day = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()

  for(let i=0;i<ct.length;i++){
    let s = ct[i].end_time ;
    let end = new Date()
    end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
    end.setHours(s.substring(0,s.indexOf(':')), s.substring(s.indexOf(':')+1) , 0);
    et.push(end)
  
  }

  let currentCourse = "0"
  if (now < et[0])
    currentCourse = "1"
  else 
    for(let i=0;i<et.length-1;i++){
      if(now>et[i] && now<et[i+1]){
        currentCourse = (i+2).toString();
        break;
      }
    }
 
    console.log(" --currentCourse--:")
    console.log( currentCourse )
  if(now > semester_startTime && now < semester_endTime){
     //console.log("+++++++get in--------")
     const data = await TimeTable.find(
      {
        teacher_id: req.body.teacher_id, 
        year:year,
        semester:semester,
        curriculum: { $elemMatch: { date: { $eq: today }  ,order:{ $elemMatch:{ $eq:currentCourse}}}},
        
      })
      .populate("course_id", "name -_id")
      .populate("teacher_id", "user_id name -_id")
      .populate("curriculum.class_id", "class_name -_id")
      .populate("curriculum.room_id", "room_number building_name -_id");
  
  
    if (!data || data.length === 0) {
      return next(new AppError("该课表不存在", 404));
    }
 
    let result = data.map(item=>{
      return{
        course_name:item.course_id.name,
        teacher_name:item.teacher_id.name,
        teacher_number:item.teacher_id.user_id,
        class_name:item.curriculum[0].class_id.class_name,
        room_number:item.curriculum[0].room_id.room_number,
        building_name:item.curriculum[0].room_id.building_name,
      }
    })
    res.status(200).json({
      status: "success",
      result,
    });
  }
  else{
    res.status(200).json({
      status: "fail",
    });
  }
});

// exports.getLatestTimeTableofTeacher11 = catchAsync(async (req, res, next) => {

//   let now = new Date();
//   let month = now.getMonth()
//   let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//   let today = week[now.getDay()]
//   let day = now.getDate()
//   let hour = now.getHours()
//   let minute = now.getMinutes()


//   let start_1 = new Date();
//   start_1.setFullYear(now.getFullYear(), month, day);
//   start_1.setHours(8, 0, 0);
//   let end_1 = new Date();
//   end_1.setFullYear(now.getFullYear(), month, day);
//   end_1.setHours(8, 50, 0);

//   let start_2 = new Date();
//   start_2.setFullYear(now.getFullYear(), month, day);
//   start_2.setHours(9, 0, 0);
//   let end_2 = new Date();
//   end_2.setFullYear(now.getFullYear(), month, day);
//   end_2.setHours(9, 50, 0);

//   let start_3 = new Date();
//   start_3.setFullYear(now.getFullYear(), month, day);
//   start_3.setHours(10, 10, 0);
//   let end_3 = new Date();
//   end_3.setFullYear(now.getFullYear(), month, day);
//   end_3.setHours(11, 00, 0);

//   let start_4 = new Date();
//   start_4.setFullYear(now.getFullYear(), month, day);
//   start_4.setHours(11, 10, 0);
//   let end_4 = new Date();
//   end_4.setFullYear(now.getFullYear(), month, day);
//   end_4.setHours(12, 0, 0);
//   // let currentTime=now.getFullYear()+"-"+now.getMonth()+1+"-"+now.getDate()
//   let start_5 = new Date();
//   start_5.setFullYear(now.getFullYear(), month, day);
//   start_5.setHours(14, 30, 0);
//   let end_5 = new Date();
//   end_5.setFullYear(now.getFullYear(), month, day);
//   end_5.setHours(15, 20, 0);

//   let start_6 = new Date();
//   start_6.setFullYear(now.getFullYear(), month, day);
//   start_6.setHours(15, 30, 0);
//   let end_6 = new Date();
//   end_6.setFullYear(now.getFullYear(), month, day);
//   end_6.setHours(16, 20, 0);

//   let start_7 = new Date();
//   start_7.setFullYear(now.getFullYear(), month, day);
//   start_7.setHours(16, 30, 0);
//   let end_7 = new Date();
//   end_7.setFullYear(now.getFullYear(), month, day);
//   end_7.setHours(17, 20, 0);

//   let start_8 = new Date();
//   start_8.setFullYear(now.getFullYear(), month, day);
//   start_8.setHours(17, 30, 0);
//   let end_8 = new Date();
//   end_8.setFullYear(now.getFullYear(), month, day);
//   end_8.setHours(18, 20, 0);

//   let start_9 = new Date();
//   start_9.setFullYear(now.getFullYear(), month, day);
//   start_9.setHours(19, 00, 0);
//   let end_9 = new Date();
//   end_9.setFullYear(now.getFullYear(), month, day);
//   end_9.setHours(20, 00, 0);

//   let start_10 = new Date();
//   start_10.setFullYear(now.getFullYear(), month, day);
//   start_10.setHours(20, 10, 0);
//   let end_10 = new Date();
//   end_10.setFullYear(now.getFullYear(), month, day);
//   end_10.setHours(22, 20, 0);

//   let currentCourse = "0"
//   if (now < end_1)
//     currentCourse = "1"
//   else if (now > end_1 && now < end_2)
//     currentCourse = "2"
//   else if (now > end_2 && now < end_3)
//     currentCourse = "3"
//   else if (now > end_3 && now < end_4)
//     currentCourse = "4"
//   else if (now > end_4 && now < end_5)
//     currentCourse = "5"
//   else if (now > end_5 && now < end_6)
//     currentCourse = "6"
//   else if (now > end_6 && now < end_7)
//     currentCourse = "7"
//   else if (now > end_7 && now < end_8)
//     currentCourse = "8"
//   else if (now > end_8 && now < end_9)
//     currentCourse = "9"
//   else if (now > end_9 && now < end_10)
//     currentCourse = "10"
//   //get school year information
//   const syInfo = await SchoolYear.findOne({current: 't'})
//   let year = syInfo.year
//   let semester = syInfo.semester
//   let semester_startTime = new Date(Date.parse(syInfo.start_time + " 00:00"));
//   let semester_endTime = new Date(Date.parse(syInfo.end_time + " 23:59")); 
  
//   if(now > semester_startTime && now < semester_endTime){
//      //console.log("+++++++get in--------")
//      const data = await TimeTable.find(
//       {
//         teacher_id: req.body.teacher_id, 
//         year:year,
//         semester:semester,
//         curriculum: { $elemMatch: { date: { $eq: today }  ,order:{ $elemMatch:{ $eq:currentCourse}}}},
        
//       })
//       .populate("course_id", "name -_id")
//       .populate("teacher_id", "user_id name -_id")
//       .populate("curriculum.class_id", "class_name -_id")
//       .populate("curriculum.room_id", "room_number building_name -_id");
  
  
//     if (!data || data.length === 0) {
//       return next(new AppError("该课表不存在", 404));
//     }
 
//     let result = result = data.map(item=>{
//       return{
//         course_name:item.course_id.name,
//         teacher_name:item.teacher_id.name,
//         teacher_number:item.teacher_id.user_id,
//         class_name:item.curriculum[0].class_id.class_name,
//         room_number:item.curriculum[0].room_id.room_number,
//         building_name:item.curriculum[0].room_id.building_name,
//       }
//     })
//     res.status(200).json({
//       status: "success",
//       result,
//     });
//   }
//   else{
//     res.status(200).json({
//       status: "fail",
//     });
//   }
// });