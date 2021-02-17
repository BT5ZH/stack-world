const mongoose = require("mongoose");
const uuid = require("uuid");
const Lesson = require("./lessonModel");
const QuesBank = require("../models/questionModel");
const studentPaper= require("./studentpaperModel");

const paperSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1,
    },
    lesson_id: {
      type: mongoose.Schema.Types.String,
      ref: "Lesson",
    },
    title: {
      type: String,
      required: [true, "each paper must have a name"],
    },
    questions: [
      { 
        type: String, 
        ref:"Question",
      }
    ],
    duration:{ type: Number, default: 60 },
    deadline: { type: String },
  },
  { _id: false }
);

paperSchema.post("save", async function (doc) {
  try {
    //find all the students based on lesson_id
    let data = await Lesson.findOne({ _id: doc.lesson_id })
      .select("classes")
      .populate({
        path: "classes",
        select: ["_id"],

        populate: {
          path: "students",
          select: ["_id"],
        },
      });

    data = data.classes;
    let students = [];
    for (let i = 0; i < data.length; i++)
      for (let j = 0; j < data[i].students.length; j++)
        students.push(data[i].students[j]._id);

    let questions=[]
    for( let i = 0;i<doc.questions.length;i++){
      let ques_id=doc.questions[i];
      let quesInfo = await QuesBank.findById(ques_id).select('statement');
      let right_answer = quesInfo.statement.right_answer;
      let student_answer='Z';
      let oneQues = {ques_id,student_answer,right_answer};
      questions.push(oneQues);
    }
    students = students.map((item) => {
      return {
        paper_id: doc._id,
        student_id: item,
        questions:questions
      };
    });
    ////////////////////////////////////////////
    const newStudentPaper = await studentPaper.insertMany(students);
  } catch (err) {
    console.log(err);
  }
});
paperSchema.pre("remove", { query: true }, async function (doc) {
  try {
    await studentPaper.deleteMany({ paper_id: this._id });
  } catch (err) {
    console.log(err);
  }
});

const Paper = mongoose.model("Paper", paperSchema);

module.exports = Paper;
