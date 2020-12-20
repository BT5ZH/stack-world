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
      ref: "Course",
    },
    lesson_id: {
      type: mongoose.Schema.Types.String,
      ref: "Lesson",
      unique: true,
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
            type: String, // 上第几节课 如：123 即上1，2，3节课，需要前端截取字符串
            required: true,
          },
        ],
        odd_or_even: {
          //weekSingle
          type: Number,
          default: 0,
          enum: [0, 1, 2], //1 means odd week. 2 means even week.
        },
        room_id: {
          type: mongoose.Schema.Types.String,
          ref: "Room",
        },
        // room_number:{
        //   type:Number,
        //   required: true,
        // },
        class_id: {
          type: mongoose.Schema.Types.String, //type: mongoose.Schema.Types.ObjectID,
          ref: "Class",
        },
        // class_name:{type: String, 
        //   required: true,
        // }
      },
    ],
  },
  {
    _id: false,
  }
);

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
