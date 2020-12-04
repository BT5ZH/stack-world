const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema(
  {
    campus: {
      type: String,
      default: "校区",
      required: [true, "   must have a campus"],
    },
    organization: { type: String, required: true }, // 键 组织
    campusAddress: { type: String },
    buildings: {
      type: [
        {
          buildingName: {
            type: String,
            required: [true, "building must have a name"],
          },
          buildingType: {
            type: String,
            required: [true, "building must have a type"],
          },
          buildingIntro: String,
        },
      ],
      validate: (p) => Array.isArray(p) && p.length > 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

campusSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "campus",
  localField: "_id",
});

const Campus = mongoose.model("campus", campusSchema);

module.exports = Campus;
