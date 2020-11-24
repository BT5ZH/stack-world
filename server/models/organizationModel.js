const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      default: "组织机构名称",
      required: [true, "organization must have an Name"],
    },
    organizationNameEn: {
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
            validate: (m) => Array.isArray(m) && m.length > 0,
          },
        },
      ],
      validate: (o) => Array.isArray(o) && o.length > 0,
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

// virtual populate
organizationSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "organization",
  localField: "_id",
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
