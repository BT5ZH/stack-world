const mongoose = require("mongoose");
const uuid = require("uuid");

const submitHomeworkSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1
    },
    homework_id: { type: mongoose.Schema.String, ref: "SetHomework" },
    student_id: { type: mongoose.Schema.String, ref: "User" },

    content: { type: String },
    comments: { type: String },
    attachment_url: { type: String },
  },
  { _id: false }
);

const SubmitHomework = mongoose.model("SubmitHomework", submitHomeworkSchema);

module.exports = SubmitHomework;
