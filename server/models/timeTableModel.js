const mongoose = require("mongoose");
const uuid = require("uuid");

const timeTableSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your id"],
      default: uuid.v1,
    },
    course_id: {
      type: mongoose.Schema.Types.String,
      ref: "Lesson",
    },
    lesson_id: {
      type: mongoose.Schema.Types.String,
      ref: "Lesson",
    },
    teacher_id: {
      type: mongoose.Schema.Types.String, //type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    curriculum: [
      {
        date: {
          type: String,
          required: true,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        order: [
          {
            type: Number,
            required: true,
          },
        ],
        odd_or_even: {
          //weekSingle
          type: Number,
          default: 0,
          enum: [0, 1, 2], //1 means odd week. 2 means even week.
        },
        location: {
          type: mongoose.Schema.Types.String,
          ref: "Room",
        },
        class_id: {
          type: mongoose.Schema.Types.String, //type: mongoose.Schema.Types.ObjectID,
          ref: "Class",
        },
      },
    ],
  },
  {
    _id: false,
  }
);

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
