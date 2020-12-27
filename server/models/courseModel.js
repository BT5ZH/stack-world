const mongoose = require("mongoose");
const uuid = require("uuid");

var courseSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your _id"],
      default: uuid.v1,
    },
    course_id: {
      type: String,
      required: [true, "you must tell us your course_id"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "you must tell us your course_name"],
    },
    org_name: {
      type: String,
      //ref: 'Org',
    },
    subOrg_name: {
      type: String,
      //ref: 'SubOrg',
    },
    major_name: {
      type: String,
      //ref: 'Major',
    },
    credit: {
      type: Number,
      required: [true, "course credit is required"],
    },
    semester: {
      type: Number,
      required: [true, "course credit is required"],
      min: 1,
      max: 8,
    },
    weekly_hrs: {
      type: Number,
      required: [true, "course weekly_hrs is required"],
    },
    experiment_or_traning_hrs: {
      type: Number,
      default: 0,
    },
    evaluation: {
      type: String,
      default: "考试",
      enum: ["考试", "考察"],
      required: [true, "course weekly_hrs is required"],
    },
    course_type: {
      type: String,
      required: [true, "course course_type is required"],
    },
    grade: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

var Course = mongoose.model("Course", courseSchema);

module.exports = Course; //暴露模块
