const mongoose = require("mongoose");

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

// virtual populate
organizationSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "organization",
  localField: "_id",
});
// organizationSchema.pre('remove', {  query: true } ,async function (doc) {

//   const building = await Building.findOne({ 
//     org_name: this.org_name, 
//     campus_name: this.campus_name,
//     building_name: this.building_name }
//   )
//   if(building != null){
//     let room = []

//     for(let i=0;i<building.rooms.length;i++){
//        if(building.rooms[i]!=this._id)
//           room.push(building.rooms[i])
//     }
  
//     await Building.updateOne(
//       { _id: building._id },
//       { $set: { rooms: room }
//     })
//   }
// });
const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
