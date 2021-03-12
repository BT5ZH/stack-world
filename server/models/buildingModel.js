const mongoose = require("mongoose");
const uuid = require("uuid");
const Campus = require("../models/campusModel");

const buildingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your building id"],
      default: uuid.v1,
    },
    building_name: {
      type: String,
      default: "楼名",
      required: [true, "building must have a name"],
    },
    building_type: {
      type: String,
      //required: [true, "building must have a type"],
      enum:["classroom","lab","office","library","others"]
    },
    rooms: [
      {
        type: mongoose.Schema.Types.String,
        ref: 'Room',
      },
    ],
    campus_name: {
      type: mongoose.Schema.Types.String,
      required: [true, "A building must belong to one campus"],
    },
    org_name: {
      type: String,
      required: [true, "A building must belong to one university or school"],
    },
  },
  {
    _id: false,
  }
);
buildingSchema.post('save', async function (doc) {
  const campus = await Campus.findOne({
    org_name: doc.org_name,
    campus_name: doc.campus_name,
    //building_name: doc.building_name }
  })
  if (campus != null) {
    let buildings = campus.buildings
    if (buildings.indexOf(doc._id) == -1) {
      buildings.push(doc._id)
    }
    await Campus.updateOne(
      { _id: campus._id },
      {
        $set: { buildings: buildings }
      })
  }
});
buildingSchema.pre('remove', { query: true }, async function (doc) {

  const campus = await Campus.findOne({
    org_name: this.org_name,
    campus_name: this.campus_name,
    // building_name: this.building_name }
  })
  if (campus != null) {
    let building = []

    for (let i = 0; i < campus.buildings.length; i++) {
      if (campus.buildings[i] != this._id)
        building.push(campus.buildings[i])
    }

    await Campus.updateOne(
      { _id: Campus._id },
      {
        $set: { buildings: building }
      })
  }
});
const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;
