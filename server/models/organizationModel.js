const mongoose = require("mongoose");

const Building = require("./buildingModel");
const Activity = require("./liveActivityModel");
const Campus = require("./campusModel");
const Class = require("./classModel");
const Course = require("./courseModel");
const Resource = require("./resourceModel");
const Room = require("./roomModel");
const User = require("./userModel");





const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      default: "组织机构名称",
      ref: "User",
      required: [true, "organization must have an Name"],
    },
    organizationNameEn: {
      type: String,
      default: "name for organization",
      required: [true, "organization must have an English Name"],
    },
    organizationDescription: {
      type: String,
      default: "name for organization",
    },
    subOrgs: {
      type: [
        {
          subOrgName: { type: String, required: true },
          subOrgIntro: String,
          majors: {
            type: [
              {
                majorName: { type: String, required: true },
                majorIntro: String,
                startDate: String,
              },
            ],
            // validate: (m) => Array.isArray(m) && m.length > 0,
          },
        },
      ],
      // validate: (o) => Array.isArray(o) && o.length > 0,
    },

    // tags: {
    //   type: [
    //     {
    //       subOrgName: { type: String, required: true },
    //       tagList: {
    //         type: [
    //           {
    //             tagName: { type: String, required: true },
    //           },
    //         ],
    //         validate: (x) => Array.isArray(x) && x.length > 0,
    //       },
    //     },
    //   ],
    //   validate: (v) => Array.isArray(v) && v.length > 0,
    // },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

organizationSchema.post('findOneAndUpdate', async function (doc) {
    var oldOrganizationName = doc.organizationName;
    if(this._update.organizationName){
      var newOrganizationName = this._update.$set.organizationName
      await Building.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Activity.updateMany({ org: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Campus.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Class.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Course.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Resource.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await Room.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
      await User.updateMany({ org_name: oldOrganizationName }, { $set: { org_name: newOrganizationName } });
    }

});
// virtual populate
organizationSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "organization",
  localField: "_id",
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
