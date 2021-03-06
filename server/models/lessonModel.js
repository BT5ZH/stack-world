const mongoose = require('mongoose');
const uuid = require("uuid");

var lessonSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true,'you must tell us your course_id'],
        default:uuid.v1
    },
    course_id:{
        type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
        ref: 'Course',
    },
    teacher_id:{
        type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
    },
    classes:[
        {
            type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
            ref: 'Class',
        },
    ],
    year:{
        type:String,//eg. '2020'-2021
    },
    semester:{
        type:Number,//eg.1 means the 1th semester; 2 means 2nd semester.
    },
    abstract:{ type: String,  },
    cover: { type: String, default: "default_lesson.jpg" },
    teaching_program: { 
        type: String,  
    },
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
  },
  {_id: false,}
);
   
lessonSchema.virtual('prepareLesson', {
    ref: 'PrepareLesson',
    localField: '_id',
    //foreignField: 'bookId',
    foreignField: 'lesson_id',
    justOne: false,
});

lessonSchema.index({ course_id: 1, teacher_id: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson',lessonSchema)

module.exports = Lesson;//暴露模块