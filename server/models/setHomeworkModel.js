const mongoose = require("mongoose");
const uuid = require("uuid");

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

    content: { type: String },
    attachment_url: { type: String },
    resource_id:{
      type:String,
      ref:"Resource"
    },

    endTime: { type: Date },
    
    hw_type: {
      type: String,
      enum: ["after", "before"],
      default: "after",
    },

  },
  { _id: false }
);
setHomeworkSchema.index({ lesson_id: 1, number_of_time: 1 }, { unique: true });
const SetHomework = mongoose.model("SetHomework", setHomeworkSchema);

module.exports = SetHomework;
