const mongoose = require("mongoose");
const uuid = require("uuid");

const submitHomeworkSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1,
    },
    homeworkId: { type: mongoose.Schema.ObjectId, ref: "SetHomework" },
    studentId: { type: mongoose.Schema.ObjectId, ref: "User" },

    content: { type: String },
    comments: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const submitHomework = mongoose.model("SubmitHomework", submitHomeworkSchema);

module.exports = submitHomework;
