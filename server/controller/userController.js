const multer = require("multer");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.userId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.getAllUsers = catchAsync(async (req, res) => {
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
  const query = User.find(JSON.parse(queryString)).select(
    "_id user_id  subOrg_name major_name title name email role active"
  );
  //   console.log(query);
  // EXECUTE QUERY
  const users = await query;
  // console.log(users);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

exports.getClassList = catchAsync(async (req, res) => {
  const nameList = req.body.curRealStudents;

  // console.log("班级学生列表");
  // console.log(nameList);
  const result = await User.find({ _id: { $in: nameList } }).select(
    "_id user_id role name "
  );
  //   console.log(query);
  // EXECUTE QUERY
  // const users = await query;
  // console.log("获取班级学生列表");
  // console.log(result);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  //const user = await User.findById(req.params.id);
  const user = await User.findOne({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.createUser = catchAsync(async (req, res) => {
  // Allow nested routes
  if (!req.body.buyCourses && !req.body.createdCourse) {
    const newUser = await User.create(req.body);
  } else if (req.body.buyCourses) {
    const selected = await User.buyCourses.push(req.body.buyCourses[0]);
  } else {
  }
  // if (!req.body.user) req.body.user = req.user.id;

  res.status(201).json({
    status: "success",
    data: {
      selected,
    },
  });
});

exports.createMultipleUsers = catchAsync(async (req, res) => {
  const multipleUsers = req.body;
  // const hashPassword = await bcrypt.hash(multipleUsers[0].password, 12);
  const hashPassword = await bcrypt.hash("dajun1234", 12);
  multipleUsers.forEach((user) => {
    if (typeof user == "object") {
      user["password"] = hashPassword;
      user["passwordConfirm"] = hashPassword;
      switch (user["role"]) {
        case "老师":
          user["role"] = "teacher";
          break;
        case "学生":
          user["role"] = "student";
          break;
        case "督导":
          user["role"] = "patrol";
          break;
        default:
          break;
      }
      switch (user["title"]) {
        case "讲师":
          user["title"] = "lecturer";
          break;
        case "副教授":
          user["title"] = "vice-professor";
          break;
        case "教授":
          user["title"] = "professor";
          break;
        case "学生":
          user["title"] = "student";
          break;
        default:
          break;
      }
    }
  });
  // console.log("++++++++");
  // console.log(multipleUsers);
  if (!multipleUsers || multipleUsers.length == 0) {
    return next(new AppError("用户列表为空或无数据", 404));
  }
  const result = await User.insertMany(multipleUsers);

  res.status(201).json({
    status: "success",
    result,
  });
});

exports.getOrgTeachers = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };

  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    (match) => `$${match}`
  );

  const query = User.find(JSON.parse(queryString)).select(
    "name email active user_id subOrg_name major_name title"
  );

  // EXECUTE QUERY
  const users = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    teachers: [...users],
  });
});

exports.createAdmin = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
exports.getTeachersBySubOrgName = catchAsync(async (req, res) => {
  const data = await User.find({
    subOrg_name: req.body.subOrg_name,
    role: "teacher",
  });
  if (!data) {
    return next(new AppError("该学院没有教师", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
exports.createTeacher = catchAsync(async (req, res) => {
  // Allow nested routes

  const newUser = await User.create(req.body);

  // if (!req.body.user) req.body.user = req.user.id;

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

exports.createStudent = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      selected,
    },
  });
});

exports.updateUserRecords = catchAsync(async (req, res) => {
  const newRecords = await User.findByIdAndUpdate(req.params.id, {
    $push: {
      buyCourses: { course: req.body.buyCourses[0].course },
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newRecords,
    },
  });
});

exports.updateMe = catchAsync(async (req, res) => {
  // console.log(req.file);
  // console.log(req.body);
  res.status(500).json({
    status: "error",
    message: "This route is not defined!",
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let hashPassword = "";
  let newData = req.body;
  if (req.body.hasOwnProperty("password")) {
    hashPassword = await bcrypt.hash(newData.password, 12);
    if (typeof newData == "object") {
      newData["password"] = hashPassword;
      // newData["passwordConfirm"] = hashPassword;
    }
  }
  // console.log(newData);

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("该用户不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined!",
  });
};
//edit by chaos
exports.getUsersBySubOrgAndSortByTitle = catchAsync(async (req, res, next) => {
  const data = await User.aggregate([
    { $match: { org_name: req.query.org_name,role:{$ne:"orgAdmin"} } },
    //{ $match: { subOrg_name: req.query.subOrg_name } },
    //{ $match: { role: 'teacher' } },
    {
      $group: {
        _id: "$subOrg_name",
        title: { $addToSet: "$title" },
        course_number: { $sum: 1 },
      },
    },
  ]);

  let result = data.map((item) => {
    let title = [];
    for (let i = 0; i < item.title.length; i++) {
      if (item.title[i] === "professor") title.push("教授");
      else if (item.title[i] === "vice-professor") title.push("副教授");
      else if (item.title[i] === "lecturer") title.push("讲师");
      else if (item.title[i] === "student") title.push("学生");
    }
    return {
      _id: item._id,
      title: title,
      number: item.course_number,
    };
  });
  if (data === [] || data === null) {
    return next(new AppError("课程不存在", 500));
  }

  res.status(200).json({
    status: "success",
    data,
    result,
  });
});
