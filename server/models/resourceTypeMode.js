const mongoose = require('mongoose');
const uuid = require("../node_modules/uuid/dist");
const resourceTypeSchema = new mongoose.Schema({
  _id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,
  },
  name: {
    type: String,
    required: [true, 'A resource must have a name'],
  },
},{_id:false});

const ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = ResourceType;
