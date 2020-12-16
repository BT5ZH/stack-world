const mongoose = require('mongoose');
const uuid = require("uuid");

var courseSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true,'you must tell us your course_id'],
        default:uuid.v4,
    },
    name: {
        type: String,
        required: [true,'you must tell us your course_name'],
    },
    org_name: {  
        type: String,
        //ref: 'Org',
    },
    subOrg_name:{ 
        type: String,
         //ref: 'SubOrg',
    },
    major_name: {  
        type: String,
        //ref: 'Major', 
    }
   
},{_id:false})


var Course = mongoose.model('Course',courseSchema)

module.exports = Course;//暴露模块