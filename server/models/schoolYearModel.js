const mongoose = require('mongoose');
const uuid = require("uuid");

var schoolYearSchema = mongoose.Schema({
    _id: {
        type: String,
        default:uuid.v1
    },
    year: {//学年
        type: String,
        required: [true,'you must tell us your year'],
    },
    semester: {//学期
        type: Number,
        required: [true,'you must tell us your semester'],
    },
    weeks:{ //教学周
        type: Number,
    
    },
    start_time:{
        type:String
    },

    end_time: {  
        type: String,
    },
    course_time:[
        {
            begin_time:{  
                type: String,
            },
            end_time:{  
                type: String,
            },
        }
    ],
    current:{
        type:String,
        default:'f'
    },
    org_name: {  
        type: String,
        required: [true, "A school year must belong to one university or school"],
      },
   
},{_id:false})


var SchoolYear = mongoose.model('SchoolYear',schoolYearSchema)

module.exports = SchoolYear;//暴露模块