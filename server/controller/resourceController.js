const Resource = require("../models/resourceModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { assumeRole } = require("../utils/aws");

exports.uploadResource = async (req, res) => {
  try {
    //获取凭证
    const Credentials = await assumeRole();

    console.log(req.body);
    //将信息插入数据库
    let url =
      "https://stack-world.s3.cn-northwest-1.amazonaws.com.cn/" + req.body.url;
    const newResource = await Resource.create({ ...req.body, url });

    //返回信息
    res.status(200).json({
      status: "success",
      message: "上传成功",
      credentials: { ...Credentials },
      fileID: newResource.toObject()._id,
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// 2021-02-27 新增本地存储 Henrenx
exports.uploadLocalResource = async (req, res) => {
  try {
    // TODO 修改为动态 url
    let url = "http://192.168.1.109/static/";
    // let url = "http://localhost:3000/static/";
    url += req.body.url;
    console.log(req.body);
    const newResource = await Resource.create({ ...req.body, url });

    //返回信息
    res.status(200).json({
      status: "success",
      message: "上传成功",
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllResources = catchAsync(async (req, res, next) => {
  console.log("organizationController getAllResources 进来啦");

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
  console.log(queryString);
  const query = Resource.find(JSON.parse(queryString))
    .select("name tags rsType url duration size click")
    .populate("authorId", "name -_id");

  //   console.log(query);
  // EXECUTE QUERY
  const resources = await query;
  console.log(resources);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: resources.length,
    resources,
  });
});

/**
 * 传入参数{user_id,res_url,collect_time,res_type,res_name}
 */
exports.collectResource = catchAsync(async (req, res) => {
  var collect_resource = req.body;
  var resource = {
    res_name: collect_resource.res_name,
    res_url: collect_resource.res_url,
    collect_time: collect_resource.collect_time,
    res_type: collect_resource.res_type,
  };
  var user_id = collect_resource.user_id;

  var user = await User.findOne({ _id: user_id });

  if (!user) {
    return next(new AppError("用户不存在", 404));
  }

  user.resources.push(resource);
  user.save();

  res.status(200).json({
    status: true,
    message: "收藏成功",
  });
});

/***
 * 根据teacher_id、lesson_id获取该教师的某门课的资源
 */
exports.getLessonResourceOfTeacher = catchAsync(async (req, res, next) => {
  var authorId = req.body.teacher_id;
  var lessonId = req.body.lesson_id;
  var resource = await Resource.find({
    authorId: authorId,
    lesson_id: lessonId,
  });

  if (resource.length === 0 || !resource) {
    // return next(new AppError("资源不存在", 404));
    res.status(200).json({
      status: true,
      resource: resource,
      statusCode: 601,
    });
  } else {
    res.status(200).json({
      status: true,
      resource: resource,
    });
  }
});
/**
 * 删除用户收藏的资源(操作的是user表)
 * 传入参数{_id,res_url}
 */
exports.deleteCollectResource = catchAsync(async (req, res) => {
  var user_id = req.body.user_id;
  var user = await User.findOne({ _id: user_id });
  if (!user) {
    return next(new AppError("用户不存在", 404));
  }
  for (var i = 0; i < user.resources.length; i++) {
    if (user.resources[i].res_rul == req.body.res_url) {
      user.resources.splice(i, 1);
      break;
    }
  }
  user.save();
  res.status(200).json({
    status: true,
    collect_resource: user.resources,
    message: "取消收藏成功",
  });
});

exports.getURLByIDs = catchAsync(async (req, res) => {
  let data = [];
  console.log(req.body.resourceIDs);
  for (let i = 0; i < req.body.resourceIDs.length; i++) {
    let url = await Resource.findById(req.body.resourceIDs[i]).select(
      "_id url name"
    );

    if (!url) {
      return next(new AppError("资源不存在", 404));
    }

    data.push(url);
  }

  res.status(200).json({
    status: true,
    data,
  });
});
/***
 * 根据org_name subOrg_name获取该学院所有老师上传的资源
 */
exports.getLessonResourceOfSubOrg = catchAsync(async (req, res) => {
  let allResources = await Resource.find({
    org_name: req.body.org_name,
    subOrg_name: req.body.subOrg_name,
  }).populate("authorId", "name -_id");

  res.status(200).json({
    status: true,
    allResources,
  });
});
exports.deleteResourceById = catchAsync(async (req, res, next) => {
  var data = await Resource.findOneAndDelete({ _id: req.params.resource_id });

  if (!data) {
    return next(new AppError("资源删除失败", 404));
  }

  res.status(200).json({
    status: true,
    message: "资源删除成功",
  });
});
// 创建资源,存本地的
exports.createResource = async (req, res) => {
  try {
    // TODO 修改为动态 url
    const newResource = await Resource.create({ ...req.body });
    //返回信息
    res.status(200).json({
      status: "success",
      message: "上传成功",
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
