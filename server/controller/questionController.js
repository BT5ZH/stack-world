const QuesBank = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Question = require("../models/questionModel");

exports.getAllQuestions = catchAsync(async (req, res, next) => {
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
  const query = QuesBank.find(JSON.parse(queryString));

  // EXECUTE QUERY
  const questions = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
      questions,
  });
});
// exports.getQuesBankByID = async (req, res) => {
//     try {
//       const data = await QuesBank.findOne({_id:req.params.ques_id});
//       res.status(200).json({
//         status: "success",
//         data,
//       });
//     } catch (err) {
//       res.status(404).json({ status: "fail", message: err });
//     }
// };
// exports.getQuesBankByDepartAndBranch = async (req, res) => {
//   try{
//         const data = await QuesBank.aggregate([ 
//             {$match: {depart_id:req.body.depart_id}},
//             {$match: {branch_id:req.body.branch_id}},
//             //{$match: {grade:req.query.grade}},
//             //{$sample: { size: req.query.amount}}, 
//             //{$project:{ _id:0,ques_id:1 }}
          
//         ]);
//         res.status(200).json({
//             status: "success",
//             data,
//         });
//   } catch (err) {console.log(err)
//       res.status(404).json({ status: "fail", message: err });
//   }
// };
// exports.getQuesBankByGrade = async (req, res) => {
//   try{
//     var data;
//     if(req.body.amount==null){
//         data = await QuesBank.find({
//               grade:req.body.grade,
//               depart_id:req.body.depart_id,
//               branch_id:req.body.branch_id
//         });
//     }else{
//         data = await QuesBank.aggregate([ 
//             {$match: {depart_id:req.body.depart_id}},
//             {$match: {branch_id:req.body.branch_id}},
//             {$match: {grade:req.body.grade}},
//             {$sample: { size: req.body.amount}}, 
//             //{$project:{ _id:0,ques_id:1 }}
          
//         ]);
//     }
//     res.status(200).json({
//       status: "success",
//       data,
//     });
//   } catch (err) {
//       res.status(404).json({ status: "fail", message: err });
//   }
// };
//fuzzy search based on the stem.
exports.getLikeQuestion = async (req, res) => {
  try {
     var reg = new RegExp(req.body.stem);
     const result = await QuesBank.find({'statement.stem':{$regex: reg}});
     res.status(200).json({
      status: "success",
      result,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createQuestion = catchAsync(async (req, res, next) => {
  const data = await QuesBank.create(req.body);
  if (!data) {
    return next(new AppError("新课表创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    data,
  });
});
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const data = await QuesBank.findOneAndDelete(req.params.id);

  if (!data) {
    return next(new AppError("该题不存在", 404));
  }
  res.status(204).json({
    status: "success",
    data,
  });
});
//----qichao adds this function on 2021-2-9-------
exports.createMultipleQuestions = catchAsync(async (req, res) => {
  const multipleQues = req.body;

  console.log("++++++++");
  console.log(multipleQues);
  if (!multipleQues || multipleQues.length == 0) {
    return next(new AppError("试题列表为空或无数据", 404));
  }
  const result = await QuesBank.insertMany(multipleQues);

  res.status(201).json({
    status: "success",
    //result,
  });
});
//-----------------------------------------------
