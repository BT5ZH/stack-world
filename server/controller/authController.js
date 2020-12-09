const jwt = require('jsonwebtoken');
const ms = require('ms');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

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
    status: 'scccess',
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  // createSendToken(user, 200, req, res);

  const token = signToken(user._id);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  console.log('----');
  console.log(decoded.exp);
  user['expiresIn'] = decoded.exp;
  res.status(200).json({
    status: 'scccess',
    token,
    data: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  // 2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again.', 401)
    );
  }
  //GRANT ACCESS TO PRETECTED ROUTE
  req.user = currentUser;
  // res.locals.user = currentUser;
  next();
});
