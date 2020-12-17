const Course = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');
// const catchAsync = require('./../utils/appError');
// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/course-simple.json`)
// );

exports.getAllCourses = catchAsync(async (req, res, next) => {
  console.log('courseController getAllCourses 进来啦');

  // BUILD QUERY
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryString);
  const query = Course.find(JSON.parse(queryString)).select(
    'rating isFavorite title price imageUrl description'
  );
  // console.log(query);
  // EXECUTE QUERY
  const courses = await query;
  // console.log(courses);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    resulrs: courses.length,
    data: {
      courses,
    },
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  console.log('getCourse 进来啦');

  const course = await Course.findById(req.params.id);
  // .populate('reviews')
  // .populate({ path: 'registedUsers', select: 'course' });

  if (!course) {
    return next(new AppError('该课程不存在', 404));
  }

  console.log(course);
  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newCourse,
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(new AppError('该课程不存在', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return next(new AppError('该课程不存在', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
