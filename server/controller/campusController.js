const Campus = require("../models/campusModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// 提供校区（Campus)、教学楼(Building)、教室(classroom)的信息管理与维护，如增删改查、导入
// getALL, get, create, update, delete
// 提供物理空间名称、类别、数量等信息展示
// 定义room的名称（编号？） ，类别：如实验室、办公室、教室等；数量信息：做统计。

exports.getAllCampus = catchAsync(async (req, res, next) => {
  console.log("campusController getAllCampus 进来啦");

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
  const query = Campus.find(JSON.parse(queryString))
    .populate({ path: "buildings", select: "name" })
    .select("campus_name buildings")
    .populate({ path: "buildings", select: "building_name" });
  //   console.log(query);
  // EXECUTE QUERY
  const campus = await query;
  console.log(campus);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: campus.length,
    data: {
      campus,
    },
  });
});

exports.getCampus = catchAsync(async (req, res, next) => {
  const campus = await Campus.findById(req.params.id);

  if (!campus) {
    return next(new AppError("该校区不存在", 404));
  }

  console.log(campus);
  res.status(200).json({
    status: "success",
    campus,
  });
});

exports.createCampus = catchAsync(async (req, res, next) => {
  console.log("🚀 ~ file: campusController.js ~ line 62 ~ exports.createCampus=catchAsync ~ req.body", req.body)
  const newCampus = await Campus.create(req.body);
  res.status(201).json({
    status: "success",
    data: newCampus,
  });
});

exports.updateCampus = catchAsync(async (req, res, next) => {
  const campus = await Campus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!campus) {
    return new new AppError("该校区不存在", 404)();
  }
  res.status(200).json({
    status: "success",
    data: {
      campus,
    },
  });
});

exports.deleteCampus = catchAsync(async (req, res, next) => {
  const campus = await Campus.findByIdAndDelete(req.params.id);

  if (!campus) {
    return next(new AppError("该校区不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: "success deleted!",
  });
});

exports.addBuilding = catchAsync(async (req, res, next) => {
  const bid = req.body;

  const newBuilding = await Campus.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $addToSet: {
        buildings: bid,
      },
    },
    {
      new: true,
      upset: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: newBuilding,
  });
});

exports.deleteBuilding = catchAsync(async (req, res, next) => {
  const bid = req.body;
  const building = await Campus.findOneAndUpdate(
    {
      _id: req.params.id,
      // subOrgs: { $elemMatch: { subOrgName: { $eq: sName } } },
    },
    {
      $pull: {
        buildings: { $in: bid },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!building) {
    return next(new AppError("该建筑不存在", 404));
  }

  res.status(204).json({
    status: "success",
    building,
  });
});
