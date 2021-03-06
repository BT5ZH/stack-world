const jwt = require("jsonwebtoken");
const ms = require("ms");
const { promisify } = require("util");
const User = require("./../models/userModel");
const Organization = require("./../models/organizationModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");


const signToken = (id) => {
  console.log(ms(process.env.JWT_EXPIRES_IN) / 1000);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: ms(process.env.JWT_EXPIRES_IN) / 1000,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email })
    .select("+password")
    .populate({ path: "organization", select: "_id" });
  let filteredUser = {};
  if (user.role == "superAdmin") {
    // 超管不需要学院
    console.log("come superAdmin");
    filteredUser = {
      class_id: user.class_id,
      title: user.title,
      photo: user.photo,
      role: user.role,
      entry_year: user.entry_year,
      _id: user._id,
      name: user.name,
      user_id: user.user_id,
      org_name: user.org_name,
      email: user.email,
      subOrg_name: user.subOrg_name,
      major_name: user.major_name,
      resources: user.resources,
    };
  } else {
    const orgEntity = await Organization.findOne({
      organizationName: user.org_name,
    }).select("_id");
    const orgId = orgEntity._id;
    user.org_id = orgId;
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    //用...无法进行对象拷贝
    filteredUser = {
      class_id: user.class_id,
      title: user.title,
      photo: user.photo,
      role: user.role,
      entry_year: user.entry_year,
      _id: user._id,
      name: user.name,
      user_id: user.user_id,
      org_name: user.org_name,
      email: user.email,
      subOrg_name: user.subOrg_name,
      major_name: user.major_name,
      resources: user.resources,
      org_id: user.org_id,
    };

  }

  // 3) If everything ok, send token to client
  // createSendToken(user, 200, req, res);

  const token = signToken(user._id);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  user["expiresIn"] = decoded.exp;
  res.status(200).json({
    status: "success",
    token,
    data: filteredUser,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // 2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please login again.", 401)
    );
  }
  //GRANT ACCESS TO PRETECTED ROUTE
  req.user = currentUser;
  // res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("您没有权限执行该操作", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("该用户不存在", 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha")
    .update(req.params.token)
    .digest("hex");
  const user = User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({ status: "success", token });
});

// 检查数据库是否存在超管，没有则默认添加
exports.initMongo = catchAsync(async (req, res, next) => {
  const superAdmin = await User.find({ name: "superAdmin" });
  console.log("🚀 ~ file: authController.js ~ line 182 ~ exports.initMongo=catchAsync ~ superAdmin", superAdmin)
  if (superAdmin.length == 0) {
    console.log("come");
    const hashPassword = await bcrypt.hash("dajun1234", 12);
    let user = {
      name: "superAdmin",
      email: "superAdmin@qq.com",
      password: hashPassword,
      passwordConfirm: hashPassword,
      title: "superAdmin",
      role: "superAdmin"
    }
    const newUser = await User.create(user)
    console.log("🚀 ~ file: authController.js ~ line 191 ~ exports.initMongo=catchAsync ~ newUser", newUser)
    if (newUser) {
      console.log("success create superAdmin");
    } else {
      console.log("err create superAdmin");
    }
  }
  else {
    console.log("superAdmin success exist");
  }
  console.log("Altas Cluster connection successful!");
});


