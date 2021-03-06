const QuesBank = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Paper = require("../models/paperModel");
const Studentpaper = require("../models/studentpaperModel");

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
    const result = await QuesBank.find({ "statement.stem": { $regex: reg } });
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
    return next(new AppError("试题创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    data,
  });
});
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const data = await QuesBank.findOneAndDelete({_id:req.params.id});

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

  if (!multipleQues || multipleQues.length == 0) {
    return next(new AppError("试题列表为空或无数据", 404));
  }
  const result = await QuesBank.insertMany(multipleQues);

  res.status(201).json({
    status: "success",
    //result,
  });
});
//////////////////////////////////////////////////////////////
//---------------------paper-----------------------
exports.createPaper = catchAsync(async (req, res, next) => {
  const data = await Paper.create(req.body);
  if (!data) {
    return next(new AppError("试卷创建失败", 500));
  }
  res.status(201).json({
    status: "success",
    data,
  });
});
exports.deletePaper = catchAsync(async (req, res, next) => {
 
  // const data = await Paper.findOneAndDelete({_id:req.params.id});

  // if (!data) {
  //   return next(new AppError("该试卷不存在", 404));
  // }
  // res.status(204).json({
  //   status: "success",
  //   //data,
  // });

  const paper = await Paper.findById(req.params.id);

  if (!paper) {
    return next(new AppError("该试卷不存在", 404));
  }
  await paper.remove();
  res.status(204).json({
    status: "success",
    paper,
  });
});

exports.getPapersByLessonID = catchAsync(async (req, res, next) => {
    const data = await Paper.find({ lesson_id:req.body.lesson_id })
    .populate('questions','statement.stem');

    if (data.length===0) {
      return next(new AppError("该课程下没有试卷", 404));
    }
    let papers=data.map((item)=>{
      let queStem=[]
      for(let i=0;i<item.questions.length;i++){
        queStem.push(item.questions[i].statement.stem)
      }

      return{
        questionNum:item.questions.length,
        questions:queStem,
        duration:item.duration,
        paper_id:item._id,
        lesson_id:item.lesson_id,
        title:item.title,
        deadline:item.deadline
      }
    })
    res.status(200).json({
      status: "success",
      papers
    });

});
exports.getquestionBankByPaperID = catchAsync(async (req, res, next) => {
  const data = await Paper.findById(req.body.paper_id ).select('_id title')
  .populate('questions','statement.stem grade question_type');

  if (!data===null) {
    return next(new AppError("该试卷下没有试题", 404));
  }
 
  let questions = data.questions;
  questions=questions.map((item)=>{
    let queStem=item.statement.stem;
    return{
      stem:queStem,
      grade:item.grade,
      question_type:item.question_type
    }
  })
  res.status(200).json({
    status: "success",
    questions,//questions
  });

});
exports.getExamInfoForStuByLessonID = catchAsync(
  async (req, res, next) => {
    try {
      const data = await Paper.aggregate([
        {
          $match: { lesson_id: req.body.lesson_id },
        },
        {
          $lookup: {
            from: "studentpapers",
            localField: "_id",
            foreignField: "paper_id",
            as: "belongedToStuPaper",
          },
        },
        {$unwind:"$belongedToStuPaper"},
   
        {
          $match: { "belongedToStuPaper.student_id": req.body.student_id },
        },
        {
          $project: {
            _id: 1,
            //course_id: 1,
            lesson_id: 1,
            title: 1,
            //content: 1,
            //questions:1,
            duration: 1,
            deadline: 1,
            "belongedToStuPaper.is_finished": 1,
            "belongedToStuPaper.questions": 1,
            "belongedToStuPaper.score": 1,
            "belongedToStuPaper.begin_time": 1,
            "belongedToStuPaper.submit_time": 1,
          },
        },
      ]);
      if (data.length === 0) {
        return next(new AppError("该课程下试卷不存在", 404));
      }
      let examList = data.map((item) => {
        let isFinished = false;
        let score = 0;

        if (item.belongedToStuPaper != null) {
          score = item.belongedToStuPaper.score;
          isFinished = item.belongedToStuPaper.is_finished;
        }

        return {
          id: item._id,
          lid: item.lesson_id,
          isFinish: isFinished, ////
          resType: 0,
          title: item.title,
          //content: item.content,
          questions: item.belongedToStuPaper.questions,
          task_type: "exam",
          deadline: item.deadline,
          score: score,
        
        };
      });
      
      res.status(200).json({
        status: "success",
        examList
  
      });
    } catch (err) {
      console.log(err);
    }
  }
);
exports.updateStudentPaper = catchAsync(async (req, res, next) => {
  const data = await Studentpaper.findOne({paper_id:req.body.paper_id,student_id:req.body.student_id}).select('questions');
  if (!data) {
    return next(new AppError("该试卷不存在", 404));
  }
  let questions = data.questions

  for(let i=0;i<questions.length;i++){
    if(questions[i].ques_id===req.body.ques_id){
      questions[i].student_answer = req.body.student_answer;
      break;
    }
  }
  req.body.questions = questions;

  const studentpaper = await Studentpaper.findOneAndUpdate(
    {paper_id:req.body.paper_id,student_id:req.body.student_id},
    req.body,
    {
      new: true,
      runValidators: true,
    }
   );

  if (!studentpaper) {
    return next(new AppError("该试卷不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      studentpaper,
    },
  });

});
exports.updateExamPaperStatus = catchAsync(async (req, res, next) => {
  const studentpaper = await Studentpaper.findOneAndUpdate(
    {paper_id:req.body.paper_id,student_id:req.body.student_id},
    req.body,
    {
      new: true,
      runValidators: true,
    }
   );

  if (!studentpaper) {
    return next(new AppError("该试卷不存在", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      studentpaper,
    },
  });

});
//-----------------------paper------------------------------
/////////////////////////////////////////////////////////////////////////
