const Organization = require("../models/organizationModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllOrganizations = catchAsync(async (req, res, next) => {
  console.log("organizationController getAllOrganizations 进来啦");

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
  const query = Organization.find(JSON.parse(queryString)).select(
    "organizationName subOrgs organizationDescription organizationNameEn"
  );
  //   console.log(query);
  // EXECUTE QUERY
  const organizations = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: organizations.length,
    data: {
      organizations,
    },
  });
});

exports.getOrganization = catchAsync(async (req, res, next) => {
  console.log("getOrganization 进来啦");
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    return next(new AppError("该课程不存在", 404));
  }
  console.log(organization);
  res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
});

exports.createOrganization = catchAsync(async (req, res, next) => {
  const newOrganization = await Organization.create(req.body);
  res.status(201).json({
    status: "success",
    data: newOrganization,
  });
});

exports.updateOrganization = catchAsync(async (req, res, next) => {
  console.log("come addSub");
  await Organization.findOneAndUpdate({ _id: req.params.id }, req.body);
  const organization = Organization.findById({_id: req.params.id});
  if (!organization) {
    return next(new AppError("该机构不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
});



exports.deleteOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findByIdAndDelete(req.params.id);

  if (!organization) {
    return next(new AppError("该机构不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addSubOrganization = catchAsync(async (req, res, next) => {
  const sName = req.body.subOrgName;
  const sIntro = req.body.subOrgIntro;
  const sMajors = req.body.majors;

  const newSubOrganization = await Organization.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $addToSet: {
        subOrgs: {
          subOrgName: sName,
          subOrgIntro: sIntro,
          majors: sMajors,
        },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: newSubOrganization,
  });
});

exports.getSubOrganizations = catchAsync(async (req, res, next) => {
  console.log("getSubOrganization 进来啦");

  const organization = await Organization.findById(req.params.id).select(
    "subOrgs"
  );

  if (!organization) {
    return next(new AppError("该院/系不存在", 404));
  }
  const result = {
    status: "success",
    subOrgs: organization.subOrgs,
  };
  res.status(200).json(result);
});

exports.updateSubOrganization = catchAsync(async (req, res, next) => {
  console.log("req:",req)
  const sName = req.body.subOrgName;
  const organization = await Organization.findOneAndUpdate(
    {
      _id: req.params.id,
      subOrgs: { $elemMatch: { subOrgName: { $eq: sName } } },
    },
    {
      $set: {
        "subOrgs.$.subOrgIntro": req.body.subOrgIntro,
        "subOrgs.$.majors": req.body.majors,  
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
  if (!organization) {
    return next(new AppError("更新院系信息出错", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
});

exports.deleteSubOrganization = catchAsync(async (req, res, next) => {
  const sName = req.body.subOrgName;
  const organization = await Organization.findOneAndUpdate(
    {
      _id: req.params.id,
      // subOrgs: { $elemMatch: { subOrgName: { $eq: sName } } },
    },
    {
      $pull: {
        subOrgs: { subOrgName: sName },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!organization) {
    return next(new AppError("该机构不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: organization,
  });
});

exports.addSubMajor = catchAsync(async (req, res, next) => {
  const sId = req.params.sid;
  const sName = req.body.subOrgName;
  const mName = req.body.majorName;
  const mIntro = req.body.majorIntro;
  const mDate = req.body.startDate;

  const newSubOrganization = await Organization.findOneAndUpdate(
    {
      _id: req.params.id,
      subOrgs: { $elemMatch: { _id: { $eq: sId } } },
    },
    {
      $push: {
        "subOrgs.$.majors": {
          majorName: mName,
          majorIntro: mIntro,
          startDate: mDate,
        },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: newSubOrganization,
  });
});

exports.getMajors = catchAsync(async (req, res, next) => {
  console.log("getMajors 进来啦");
  // const organization = await Organization.findOne(
  //   {
  //     organizationName: req.params.id,
  //     subOrgs: { $elemMatch: { subOrgName: { $eq: req.params.sid } } },
  //   },
  //   {
  //     "subOrgs.$": 1,
  //   }
  // );

  const organization = await Organization.aggregate([
    { $unwind: "$subOrgs" },
    { $match: { organizationName: req.params.id } },
    { $match: { "subOrgs.subOrgName": req.params.sid } },
    {
      $project: {
        "subOrgs.majors": 1,
      },
    },
  ]);
  if (!organization) {
    return next(new AppError("该院/系不存在", 404));
  }

  res.status(200).json({
    status: "success",
    majors: organization[0].subOrgs.majors,
    //majors: organization.subOrgs[0].majors,
  });
});

exports.updateMajor = catchAsync(async (req, res, next) => {
  console.log("updateMajor 进来啦");
  const sName = req.body.subOrgName;
  const mName = req.body.majorName;
  const resultInfo = await Organization.updateMany(
    {
      _id: req.params.id,
      subOrgs: {
        $elemMatch: {
          subOrgName: { $eq: sName },
          //   "majors.majorName": { $eq: mName },
        },
      },
    },
    {
      $set: {
        "subOrgs.$[t1].majors.$[t2].majorIntro": req.body.majorIntro,
        "subOrgs.$[t1].majors.$[t2].startDate": req.body.startDate,
      },
    },
    {
      arrayFilters: [
        { "t1.subOrgName": { $eq: sName } },
        { "t2.majorName": { $eq: mName } },
      ],
    }
  );

  if (!resultInfo) {
    return next(new AppError("更新院系信息出错", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      resultInfo,
    },
  });
});

exports.deleteMajor = catchAsync(async (req, res, next) => {
  const sName = req.body.subOrgName;
  console.log(sName);
  const mName = req.body.majorName;
  const mDate = req.body.startDate;
  console.log(mName);
  const organization = await Organization.updateMany(
    {
      _id: req.params.id,
      subOrgs: {
        $elemMatch: {
          subOrgName: { $eq: sName },
        },
      },
    },
    {
      $pull: {
        "subOrgs.$.majors": { majorName: mName },
      },
    },
    {
      //   arrayFilters: [
      // { "t1.subOrgName": { $eq: sName } },
      // { "t2.majorName": { $eq: mName } },
      // { t2: { $type: object } },
      //   ],
    }
  );
  console.log(organization);
  if (!organization) {
    return next(new AppError("该机构不存在", 404));
  }

  res.status(204).json({
    status: "success",
    data: organization,
  });
});

exports.getOrgTree = catchAsync(async (req, res, next) => {
  console.log("getOrganization 进来啦");

  const orgTree = await Organization.findById(req.params.id).select(
    "organizationName subOrgs.subOrgName subOrgs.majors.majorName"
  );

  if (!orgTree) {
    return next(new AppError("该课程不存在", 404));
  }

  console.log(orgTree);
  res.status(200).json({
    status: "success",
    tree: orgTree.subOrgs,
  });
});
