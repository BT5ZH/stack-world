const mongoose = require("mongoose");
const uuid = require("uuid");

const subOrgSchema = new mongoose.Schema(
  {
    _id: {
        type: String,
        required: [true,'you must tell us your orgId'],
        default:uuid.v1,
      },
    name: {
      type: String,
      default: "二级组织机构名称",
      required: [true, "sub-organization must have an Name"],
    },
    englishName: {
      type: String,
      default: "name for sub-organization",
    },
    description: {
      type: String,
      default: "name for sub-organization",
    },
    majors: [
        {
            type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
            ref: 'Major',
        },
    ],
 },{_id:false}
);

const SubOrg = mongoose.model("SubOrg", subOrgSchema);

module.exports = SubOrg;
