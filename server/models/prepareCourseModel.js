const mongoose = require("mongoose");
const uuid = require("uuid");

const prepareCourseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1
    },
    courseId: {
      type: String
    },
    courseName: {
      type: String
    },
    teacherId: {
      type: String
    },
    oneClass: [
      {
        lessonName: {
          //课时名
          type: String
        },
        ppt: {
          //PPTurl
          type: String,
          required: [true, "A course must have a ppt"]
        },
        duration: {
          type: Number,
          default: 50
        },

        description: {
          type: String,
          required: [true, "A course must have a description"]
        },
        nodes: [
          {
            tag: {
              type: String,
              default: "Teach",
              enum: [
                "Teach",
                "Sign",
                "Ask",
                "Race",
                "Vote",
                "Dispatch",
                "Test",
                "Homework"
              ]
            },
            start: Number,
            end: Number,
            content: String,
            options: [{ type: String }]
          }
        ]
      }
    ]
  },
  { _id: false }
);

const prepareCourse = mongoose.model("prepareCourse", prepareCourseSchema);

module.exports = prepareCourse;
