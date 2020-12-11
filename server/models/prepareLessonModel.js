const mongoose = require("mongoose");
const uuid = require("uuid");

const prepareLessonSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1
    },
    lesson_id: {
      type: mongoose.Schema.Types.String,
      ref: "Lesson"
      // type:String
    },
    teacher_id: {
      type: mongoose.Schema.Types.String,
      ref: "User"
      // type:String

    },
    one_class: [
      {
        name: {
          type: String,
          //required: [true, "One class must have a name"]
        },
        PPT: {
          type: String //URL
        },
        duration: {
          type: Number,
          default: 50
        },
        description: {
          type: String
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
            options: [{ type: String }],
            attachment_url: { type: String } //use to save the attachment url of one homework
          }
        ]
      }
    ]
  },
  { _id: false }
);

const PrepareLesson = mongoose.model("PrepareLesson", prepareLessonSchema);

module.exports = PrepareLesson;
