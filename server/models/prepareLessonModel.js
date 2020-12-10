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
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Course',
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectID,
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
                              enum: ['Teach', 'Sign','Ask','Race','Vote','Dispatch','Test','Homework',],
                      },
                      start: Number,
                      end:Number,
                      content:String,
                      options:[{type:String,}],
                  }
              ],
        }
    ]
  },
  { _id: false }
);

<<<<<<< HEAD:server/models/prepareCourseModel.js
const prepareCourse = mongoose.model("prepareCourse", prepareCourseSchema);

module.exports = prepareCourse;
=======
const PrepareLesson = mongoose.model('PrepareLesson', prepareLessonSchema);

module.exports = PrepareLesson;
>>>>>>> c19221dd09c8b80ff5814df9ef6056709ecbc49a:server/models/prepareLessonModel.js
