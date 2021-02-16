const mongoose = require("mongoose");
const uuid = require("uuid");
const Lesson = require("./lessonModel");
const Class = require("./classModel");
//const SubmitPaper = require("./submitPaperModel");

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

// paperSchema.post("save", async function (doc) {
//   try {
//     let data = await Lesson.findOne({ _id: doc.lesson_id })
//       .select("classes")
//       .populate({
//         path: "classes",
//         select: ["_id"],

//         populate: {
//           path: "students",
//           select: ["_id"],
//         },
//       });

//     data = data.classes;
//     let students = [];
//     for (let i = 0; i < data.length; i++)
//       for (let j = 0; j < data[i].students.length; j++)
//         students.push(data[i].students[j]._id);
//     students = students.map((item) => {
//       return {
//         homework_id: doc._id,
//         student_id: item,
//       };
//     });
//     const newHomewrok = await SubmitHomework.insertMany(students);
//   } catch (err) {
//     console.log(err);
//   }
// });
// paperSchema.pre("remove", { query: true }, async function (doc) {
//   try {
//     await SubmitHomework.deleteMany({ homework_id: this._id });
//     //in future, based on which conditions, when the teacher deletes one homework
//   } catch (err) {
//     console.log(err);
//   }
// });
const Paper = mongoose.model("Paper", paperSchema);

module.exports = Paper;
