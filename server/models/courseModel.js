const mongoose = require('mongoose');
const uuid = require("uuid");

var courseSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true,'you must tell us your course_id'],
        default:uuid.v1,
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
    },
    // school: {
    //     type: String,
    //     required: [true,'you must tell us your school'],
    // },
    // // 学院
    // academy: {
    //     type: String,
    //     required: [true,'you must tell us your academy'],
    // },
    // // 专业
    // profession: {
    //     type: String,
        
    // },

   
},{_id:false})


var Course = mongoose.model('Course',courseSchema)

module.exports = Course;//暴露模块