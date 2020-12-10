const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const setHomeworkSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1,
    },
    courseId: { type: mongoose.Schema.ObjectId, ref: "Course" },
    courseTimes: { type: Number, required: true, min: 1, max: 32 },
    teacherId: { type: mongoose.Schema.ObjectId, ref: "User" },

    content: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const setHomework = mongoose.model("SetHomework", setHomeworkSchema);

module.exports = setHomework;
