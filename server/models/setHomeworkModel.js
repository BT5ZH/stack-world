const mongoose = require("mongoose");
const uuid = require("uuid");
const Lesson = require("../models/lessonModel");
const Class = require("../models/classModel");
const SubmitHomework = require("./submitHomeworkModel");

const setHomeworkSchema = new mongoose.Schema(
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

    number_of_time: { type: Number, required: true, min: 0 },
    //teacher_id: { type: mongoose.Schema.ObjectId, ref: "User" },
    title:{ type: String , required: [true, "each homework or preview must have a name"],},
    content: { type: String ,default:""},
    attachment_url: { type: String ,default:""},
 
    resource_id:{
      type:String,
      ref:"Resource"
    },

    deadline: { type: String },
    
    task_type: {
      type: String,
      enum: ["preview", "homework"],
      default: "homework",
    },

  },
  { _id: false }
);
setHomeworkSchema.index({ lesson_id: 1, number_of_time: 1, task_type: 1}, { unique: true });

setHomeworkSchema.post("save", async function (doc) {
  try{
    let data = await Lesson.findOne({_id:doc.lesson_id}).select("classes")
    .populate({
      path: 'classes',
      select: ['_id'],

      populate:{
        path: 'students',
        select: ['_id']
      }
    });

    data = data.classes;
    let students=[]
    for(let i=0;i<data.length;i++)
      for(let j=0;j<data[i].students.length;j++)
          students.push(data[i].students[j]._id)
    
    for(let i=0; i<students.length; i++){
        const newHomewrok = await SubmitHomework.create(
          { 
            homework_id: doc._id, 
            student_id:students[i]
          }
        );
    }
  }catch(err){console.log(err)}
});
setHomeworkSchema.pre("remove", { query: true }, async function (doc) {
  try{ 
        await SubmitHomework.deleteMany({homework_id:this._id});
        //in future, based on which conditions, when the teacher deletes one homework
  }catch(err){console.log(err)}
});
const SetHomework = mongoose.model("SetHomework", setHomeworkSchema);

module.exports = SetHomework;
