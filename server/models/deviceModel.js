const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceID: {
      type: String,
      required: [true, "class must have an deviceID"],
      unique: true,
    },
    deviceName: {
      type: String,
      required: [true, "class must have an deviceName"],
    },
    deviceLocation: {
      type: String,
      required: [true, "class must have an deviceLocation"],
    },
    deviceIP: {
      type: String,
      required: [true, "class must have an deviceIP"],
    },
    deviceMAC: {
      type: String,
      required: [true, "class must have an deviceMAC"],
      unique: true,
    },
    deviceStatus: {
      type: String,
      required: [true, "class must have an deviceMAC"],
      enum: ["running", "stopping", "starting", "stopped"],
    },
    deviceActiveStatus: {
      type: String,
      required: [true, "class must have an deviceActiveStatus"],
      enum: ["active", "inactive"],
    },
    deviceController: {
      type: [{ start: { type: Boolean, default: false } }],
    },
    deviceResources: {
      type: [{ updatePackageURL: { type: String } }],
    },
    orgName: {
      type: String,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
