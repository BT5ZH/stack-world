const mongoose = require("mongoose");
const uuid = require("uuid");
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
const SetHomework = mongoose.model("SetHomework", setHomeworkSchema);

module.exports = SetHomework;
