const TimeTable = require("../models/timeTableModel");
const SchoolYear = require("../models/schoolYearModel");
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
});
exports.createTimeTable = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.body.lesson_id).select(
    "_id teacher_id course_id"
  );
  if (!lesson) {
    return next(new AppError("该课程不存在", 404));
  }
  let NewTimeTable = await TimeTable.create({
    course_id: lesson.course_id,
    lesson_id: lesson._id,
    teacher_id: lesson.teacher_id,
    curriculum: req.body.curriculum,
  });
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

// 获取完整巡课信息
exports.getPatrolMessage = catchAsync(async (req, res, next) => {
  let data = await TimeTable.find()
    .populate("course_id", "org_name  subOrg_name major_name name")
    .populate("teacher_id", "name")
    .populate("curriculum.class_id", "class_name")
    .populate("curriculum.room_id", "room_number room_status living_lessonID")
    .select("_id course_id teacher_id curriculum lesson_id ");

  // 数据处理(只选取living的教室)
  if (data || data.length !== 0) {
    //学院判断,因为timeTable表没有org属性
    data = data.filter((child) => {
      return child.course_id.org_name == req.params.orgName;
    });
    data = data.filter((x) => {
      let status = false;
      x.curriculum.forEach((item) => {
        if (!item.room_id) return;
        if (item.room_id.room_status == "living") {
          if (item.room_id.living_lessonID !== x.lesson_id) {
            status = false;
            return;
          }
          status = true;
        } else {
          status = false;
        }
      });
      return status;
    });
  }

  if (!data || data.length === 0) {
    return next(new AppError("巡课信息为空", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getTimeTableFromTeacherID = catchAsync(async (req, res, next) => {
  const data = await TimeTable.find({ teacher_id: req.body.teacher_id })
    .populate("course_id", "name -_id")
    .populate("teacher_id", "user_id name -_id")
    .populate("curriculum.class_id", "class_name _id students")
    .populate("curriculum.room_id", "room_number _id");

  if (!data || data.length === 0) {
    return next(new AppError("该课表不存在", 404));
  }

  let result = [];
  for (let i = 0; i < data.length; i++) {
    let oneLesson = await Lesson.findById(data[i].lesson_id);
    if (
      oneLesson.year === req.body.year &&
      oneLesson.semester === Number(req.body.semester)
    )
      result.push(data[i]);
  }

  res.status(200).json({
    status: "success",
    data, //get all the timetable data of the teacher selected without regard to the year and sememser
    result, //according to the given year and semester, return the suitable timetable of the teacher selected
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
      course_name: item.Course[0].name,
    };
  });

  let result = [];
  for (let i = 0; i < temp.length; i++) {
    let oneLesson = await Lesson.findById(temp[i].lessonID);
    if (
      oneLesson.year === req.query.year &&
      oneLesson.semester === Number(req.query.semester)
    )
      result.push(temp[i]);
  }
  res.status(200).json({
    status: "success",
    temp, //the temp array saves all the timetable data of the room selected without regard to the year and sememser
    result, //according to the given year and semester, return the suitable timetable of the room selected
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
    if (result.length === 0) {
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
  console.log("lessonsOfOneClass", lessonsOfOneClass);
  for (let j = 0; j < lessonsOfOneClass.length; j++) {
    if (
      lessonsOfOneClass[j].year == req.body.year &&
      lessonsOfOneClass[j].semester == req.body.semester
    ) {
      lessonIdList.push(lessonsOfOneClass[j]._id);
    }
  }

  for (let i = 0; i < lessonIdList.length; i++) {
    console.log("lessonIdList[i]=====" + lessonIdList.length);
    console.log(lessonIdList[i]);
    const data = await TimeTable.findOne({ lesson_id: lessonIdList[i] })
      .populate("course_id", "name")
      .populate("teacher_id", "name")
      .populate({
        path: "curriculum.room_id",
        populate: { path: "building" },
      })
      .populate("curriculum.class_id", "class_name -_id");

    if (data) result.push(data);
  }
  if (result.length === 0) {
    return next(new AppError("课表不存在", 200));
  }

  res.status(200).json({
    status: "success",
    result,
  });
});
exports.getTimeTableFromLessonID = catchAsync(async (req, res, next) => {
  console.log("getTimeTableFromLessonID " + "=====");
  console.log(req.body);
  const data = await TimeTable.find({ lesson_id: req.body.lesson_id })
    //.populate("course_id", "name -_id")
    //.populate("teacher_id", "user_id name -_id")
    .populate("curriculum.class_id", "class_name _id")
    .populate(
      "curriculum.room_id",
      "room_number campus_name building_name _id"
    );

  if (!data || data.length === 0) {
    return next(new AppError("该课表不存在", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});
//接收两个日期值（字符串新式，如，‘2020–8-31 00:00’，‘2021–1-10 00:00’），将这个时间段按照一周一个单位划分出来，
//以一周为一个单元存入一个数组，最终返回的是一个二维数组，一维为给定时间段划分出的周数，二维为每一个周，存储单元为一个日期字符串，如'2020-08-03'、'2020-11-13'
//注意：年为四位，月和日为两位（如'2020-08-03'、'2020-11-13'）
function weeks(time1, time2) {
  let time = []; // 结果数组
  let statime = new Date(Date.parse(time1));
  let week = statime.getDay(); // 开始日期的星期
  let starttime;
  if (week == 0) {
    // 保证起始日期为周一
    starttime = +new Date(time1) - 1000 * 60 * 60 * 24 * 6;
  } else {
    starttime = +new Date(time1) - 1000 * 60 * 60 * 24 * (week - 1);
  }
  let endtime = +new Date(time2);
  let times = (endtime - starttime) / 1000;
  let d = parseInt(times / 60 / 60 / 24) + 1; // 需要存放的天数

  for (let i = 0; i <= d / 7; i++) {
    let weeks = new Object(); // 存放日期对象
    if (i === parseInt(d / 7)) {
      // 判断最后一周是否够7天
      if (d % 7 == 0) break;
      n = d % 7;
    } else {
      n = 7;
    }
    for (let j = 1; j <= n; j++) {
      switch (j) {
        case 1:
          weeks.Mon = new Date(starttime + 1000 * 60 * 60 * 24 * 1);
          break;
        case 2:
          weeks.Tues = new Date(starttime + 1000 * 60 * 60 * 24 * 2);
          break;
        case 3:
          weeks.Wed = new Date(starttime + 1000 * 60 * 60 * 24 * 3);
          break;
        case 4:
          weeks.Thur = new Date(starttime + 1000 * 60 * 60 * 24 * 4);
          break;
        case 5:
          weeks.Fri = new Date(starttime + 1000 * 60 * 60 * 24 * 5);
          break;
        case 6:
          weeks.Sat = new Date(starttime + 1000 * 60 * 60 * 24 * 6);
          break;
        case 7:
          weeks.Sun = new Date(starttime + 1000 * 60 * 60 * 24 * 7);
          break;
      }
    }
    time[i] = weeks;
    starttime = starttime + 1000 * 60 * 60 * 24 * 7;
  }
  let wholeWeek = [];
  for (let i = 0; i < time.length; i++) {
    let oneWeek = [];
    if (time[i].Mon) {
      let MonString = time[i].Mon.toISOString().substring(0, 10);
      oneWeek.push(MonString);
    }
    if (time[i].Tues) {
      let TueString = time[i].Tues.toISOString().substring(0, 10); //time[i].Tues.getUTCFullYear()+"-"+time[i].Tues.getMonth()+1+"-"+time[i].Tues.getUTCDate()
      oneWeek.push(TueString);
    }
    if (time[i].Wed) {
      let WedString = time[i].Wed.toISOString().substring(0, 10); //time[i].Wed.getUTCFullYear()+"-"+time[i].Wed.getMonth()+1+"-"+time[i].Wed.getUTCDate()
      oneWeek.push(WedString);
    }
    if (time[i].Thur) {
      let ThuString = time[i].Thur.toISOString().substring(0, 10); //time[i].Thur.getUTCFullYear()+"-"+time[i].Thur.getMonth()+1+"-"+time[i].Thur.getUTCDate()
      oneWeek.push(ThuString);
    }
    if (time[i].Fri) {
      let FriString = time[i].Fri.toISOString().substring(0, 10); //time[i].Fri.getUTCFullYear()+"-"+time[i].Fri.getMonth()+1+"-"+time[i].Fri.getUTCDate()
      oneWeek.push(FriString);
    }
    if (time[i].Sat) {
      let SatString = time[i].Sat.toISOString().substring(0, 10); //time[i].Sat.getUTCFullYear()+"-"+time[i].Sat.getMonth()+1+"-"+time[i].Sat.getUTCDate()
      oneWeek.push(SatString);
    }
    if (time[i].Sun) {
      let SunString = time[i].Sun.toISOString().substring(0, 10); //time[i].Sun.getUTCFullYear()+"-"+time[i].Sun.getMonth()+1+"-"+time[i].Sun.getUTCDate()
      oneWeek.push(SunString);
    }
    wholeWeek.push(oneWeek);
  }
  return wholeWeek;
}
exports.getLatestTimeTableofTeacher = catchAsync(async (req, res, next) => {
  //get school year information
  const syInfo = await SchoolYear.findOne({ current: "t" }); //从schoolYear表里取学期起始终止信息
  let year = syInfo.year;
  let semester = syInfo.semester;
  let semester_startTime = new Date(Date.parse(syInfo.start_time + " 00:00"));
  let semester_endTime = new Date(Date.parse(syInfo.end_time + " 23:59"));
  let ct = syInfo.course_time; //一天内课程时间的安排
  let et = [];
  //获得当前东八区的时间，并赋值给 now
  let timeZone = 8;
  let offset_GMT = new Date().getTimezoneOffset();
  var nowDate = new Date().getTime();
  var now = new Date(
    nowDate + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000
  );
  //
  let month = now.getMonth();
  let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = week[now.getDay()];
  let day = now.getDate();

  let weekMatrix = weeks(
    syInfo.start_time + " 00:00",
    syInfo.end_time + " 23:59"
  ); //weekMatrix[][]里存储的是本学期时段划分出的所有周，每周里包含具体日期
  let currentTime = now.toISOString().substring(0, 10); //把Date（）对象转换成格式为‘yyyy-mm-dd’字符串
  let odd_or_even = 0;
  //在weekMatrix二维数组中确定今天所在的周是奇数周还是偶数周
  for (let i = 0; i < weekMatrix.length; i++) {
    for (let j = 0; j < weekMatrix[i].length; j++) {
      if (weekMatrix[i][j] === currentTime) {
        if (i % 2 === 0) odd_or_even = 1;
        //代表今天所在周是奇数周
        else odd_or_even = 2; //代表今天所在周是偶数周
        break;
      }
    }
  }
  //--------------------------------------------------

  //判断与当前时间最近的课程是第几节
  for (let i = 0; i < ct.length; i++) {
    let s = ct[i].end_time;
    let end = new Date();
    end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    end.setHours(
      s.substring(0, s.indexOf(":")),
      s.substring(s.indexOf(":") + 1),
      0
    );
    et.push(end);
  }

  let currentCourse = "0"; //用于存储距离当前时间最近的是第几节课
  if (now < et[0]) {
    currentCourse = "1";
  } else
    for (let i = 0; i < et.length - 1; i++) {
      if (now > et[i] && now < et[i + 1]) {
        currentCourse = (i + 2).toString();
        break;
      }
    }
  ////----------------------------------------------------------------------------------
  if (now > semester_startTime && now < semester_endTime) {
    //console.log("+++++++get in--------")
    const data = await TimeTable.find({
      teacher_id: req.body.teacher_id,
      year: year,
      semester: semester,
      curriculum: {
        $elemMatch: {
          date: { $eq: today },
          order: { $elemMatch: { $eq: currentCourse } },
        },
      },
    })
      .populate("course_id", "name -_id")
      .populate("teacher_id", "user_id name -_id")
      .populate("curriculum.class_id", "class_name -_id")
      .populate("curriculum.room_id", "room_number building_name -_id");

    if (!data || data.length === 0) {
      return next(new AppError("当前时刻无课程安排", 404));
    }
    //如果课表中存储的是全周课，那么odd_or_even为零
    if (
      data[0].curriculum[0].odd_or_even != 0 &&
      data[0].curriculum[0].odd_or_even != odd_or_even
    ) {
      return next(new AppError("当前时刻无课程安排", 404));
    }

    let result = data.map((item) => {
      return {
        lesson_id: item.lesson_id,
        course_name: item.course_id.name,
        teacher_name: item.teacher_id.name,
        teacher_number: item.teacher_id.user_id,
        class_name: item.curriculum[0].class_id.class_name,
        room_number: item.curriculum[0].room_id.room_number,
        building_name: item.curriculum[0].room_id.building_name,
      };
    });
    res.status(200).json({
      status: "success",
      result,
    });
  } else {
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
