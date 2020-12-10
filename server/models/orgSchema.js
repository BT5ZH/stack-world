const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const orgSchema = new mongoose.Schema(
  {
    _id: {
        type: String,
        required: [true,'you must tell us your orgId'],
        default:uuid.v1,
      },
    name: {
        type: String,
        default: "组织机构名称",
        required: [true, "organization must have an Name"],
      },
    englishName: {
        type: String,
        default: "name for organization",
      },
    description: {
        type: String,
        default: "name for organization",
      },
    subOrgs: [
        {
            type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
            ref: 'SubOrg',
        },
    ],
 },{_id:false}
);

// virtual populate
// organizationSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "organization",
//   localField: "_id",
// });

const Org = mongoose.model("Org", orgSchema);

module.exports = Org;
