const mongoose = require("mongoose");
const uuid = require("uuid");

const submitHomeworkSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1
    },

    homework_id:{
      type: mongoose.Schema.Types.String,
      ref: 'SetHomework',
    },
    student_id:{
      type: mongoose.Schema.Types.String,
      ref: 'User',
    },

    content: { type: String, default: "答："},
    attachment_url: { type: String },

    comments: { type: String, default: "未评"},
    score: { type: Number, default: 0 },

    flg: { type: Number, default: 0 },
  },
  { _id: false }
);

const SubmitHomework = mongoose.model("SubmitHomework", submitHomeworkSchema);

module.exports = SubmitHomework;
