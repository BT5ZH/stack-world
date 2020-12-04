const mongoose = require("mongoose");

const timeTableSchema = new mongoose.Schema(
  {
    courseId: { type: Number, required: true },
    courseName: { type: String, required: true },
    courseStartYear: { type: Date, required: true },
    location: { type: Object, required: true },
    courseSemaster: {
      type: String,
      required: true,
      enum: ["spring", "autumn"],
    },
    weekSingle: {
      type: String,
      default: "both",
      enum: ["true", "false", "both"],
    },

    curriculum: {
      type: [
        {
          date: {
            type: String,
            required: true,
            enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          order: {
            type: Array,
            required: true,
          },
        },
      ],
    },

    teacherId: { type: Number, required: true },
    studentId: [
      {
        type: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

timeTableSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "timeTable",
  localField: "_id",
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
