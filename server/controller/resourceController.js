const Resource = require("../models/resourceModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const { assumeRole } = require("../utils/aws");

exports.uploadResource = async (req, res) => {
  try {
    //获取凭证
    const Credentials = await assumeRole();

    console.log(req.body);
    //将信息插入数据库
    const newResource = await Resource.create(req.body);

    //返回信息
    res.status(200).json({
      status: "success",
      message: "上传成功",
      credentials: { ...Credentials },
      fileID: newResource.toObject()._id
    });
  } catch (err) {
    console.log("上传失败");
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.getAllResources = catchAsync(async (req, res, next) => {
  console.log("organizationController getAllResources 进来啦");

  // BUILD QUERY
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach(el => delete queryObj[el]);

  // 2) Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|le)\b/g,
    match => `$${match}`
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
    resources
  });
});

/**
 * 传入参数{user_id,res_url,collect_time,res_type,res_name}
 */
exports.collectResourse = catchAsync(async (req, res) => {
  try {
    var collect_resourse = req.body;
    var resourse = {
      res_name: collect_resourse.res_name,
      res_url: collect_resourse.res_url,
      collect_time: collect_resourse.collect_time,
      res_type: collect_resourse.res_type
    };
    var user_id = collect_resourse.user_id;

    var user = await User.findOne({ user_id: user_id });
    user.resources.push(resourse);
    user.save();

    res.status(200).json({
      status: true,
      message: "收藏成功"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: err
    });
  }
});

/**
 * 删除用户收藏的资源
 * 传入参数{user_id,res_url}
 */
exports.deleteCollectResourse = catchAsync(async (req, res) => {
  try {
    var user_id = req.body.user_id;
    var user = await User.findOne({ user_id: user_id });
    for (var i = 0; i < user.resourses.length; i++) {
      if (user.resourses[i].res_rul == req.body.res_url) {
        user.resourses.splice(i, 1);
        break;
      }
    }
    user.save();
    res.status(200).json({
      status: true,
      collect_resourse:user.resourses,
      message: "取消收藏成功"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: err
    });
  }
});
