const mongoose = require('mongoose');
const uuid = require("../node_modules/uuid/dist");

const prepareCourseSchema = new mongoose.Schema(
  {
    _id:{
        type:String,
        required: [true, 'Please tell us the ID'],
        default:uuid.v1,
    
    },
    courseId: {
      type: String
      // type: mongoose.Schema.Types.ObjectID,
      // ref: 'Course',
    },
    teacherId: {
      type: String
    },
    duration: {
      type: Number,
      default:50
    },

    description: {
      type: String,
      required: [true, 'A course must have a description'],
    },

    nodes: [
        {
            tag: {
                    type: String,
                    default: 'Teach',
                    enum: ['Teach', 'Sign','Ask','Race','Vote','Dispatch','Test'],
            },
            start: Number,
            end:Number,
            content:String,
            options:[{type:String,}],
        }
    ],

  },{_id:false});

const prepareCourse = mongoose.model('prepareCourse', prepareCourseSchema);

module.exports = prepareCourse;
