const mongoose = require('mongoose');
const uuid = require("uuid");

var schoolYearSchema = mongoose.Schema({
    _id: {
        type: String,
        default:uuid.v4().replace(/\-/g, ''),
    },
    year: {//学年
        type: String,
        required: [true,'you must tell us your year'],
    },
    semester: {//学期
        type: String,
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
    }

   
},{_id:false})


var SchoolYearSchema = mongoose.model('SchoolYear',schoolYearSchema)

module.exports = SchoolYearSchema;//暴露模块