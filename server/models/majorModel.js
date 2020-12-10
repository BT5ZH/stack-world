const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const majorSchema = new mongoose.Schema(
  {
    _id: {
        type: String,
        required: [true,'you must tell us your orgId'],
        default:uuid.v1,
      },
    name: {
      type: String,
      default: "组织机构名称",
      required: [true, "major must have an Name"],
    },
    englishName: {
      type: String,
      default: "name for major",
    },
    description: {
      type: String,
      default: "name for major",
    },
    
 },{_id:false}
);

const Major = mongoose.model("Major", subOrgSchema);

module.exports = Major;