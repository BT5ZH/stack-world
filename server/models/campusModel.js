const mongoose = require("mongoose");
const uuid = require("uuid");

const campusSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your campus id'],
      default:uuid.v4,
    },
    campus_name: {
      type: String,
      default: "校区",
      required: [true, "campus must have a name"],
    },
    //organization: { type: String, required: true }, // 键 组织
    org_name: {  
      type: String,
    },
    address: { type: String },
    buildings: [
      {
        type: mongoose.Schema.Types.String,
        ref: 'Building',
      },
    ],
  },{_id:false}
);

const Campus = mongoose.model("campus", campusSchema);

module.exports = Campus;
