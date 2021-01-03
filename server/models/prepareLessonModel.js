const mongoose = require("mongoose");
const uuid = require("uuid");

const prepareLessonSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please tell us the ID"],
      default: uuid.v1
    },
    lesson_id:{
        type: mongoose.Schema.Types.String,
        ref: 'Lesson',
    },
    teacher_id: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
    },
    one_class:[
        {
          name:  {
            type:String,
            required: [true, 'One class must have a name'],
          },
          PPT:{
              type:String,//URL
            },
          duration: {
                type: Number,
                default:50
          },
          description: {
              type: String,
            
          },
          nodes: [
                  {
                      tag: {
                              type: String,
                              default: 'Teach',
                              enum: ['Teach', 'Sign','Ask','Race','Vote','Dispatch','Test'],
                      },
                      time:String,
                      people_num:Number,
                      vote:[{title:String,options:[String],right_answer:String,question_type:String,}],
                  }
          ],
        }
    ]
  },
  { _id: false }
);

const PrepareLesson = mongoose.model("PrepareLesson", prepareLessonSchema);

module.exports = PrepareLesson;
