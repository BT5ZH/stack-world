const mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true,'you must tell us your course_id'],
    },
    name: {
        type: String,
        required: [true,'you must tell us your course_name'],
    },
    school: {
        type: String,
        required: [true,'you must tell us your school'],
    },
    // 学院
    academy: {
        type: String,
        required: [true,'you must tell us your academy'],
    },
    // 专业
    profession: {
        type: String,
        
    },
},{_id:false})


var courseModel = mongoose.model('Course',courseSchema)

module.exports = courseModel;//暴露模块