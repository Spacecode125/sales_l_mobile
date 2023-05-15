const Mongoose = require("mongoose");
const DeviceStatusSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descriptionBeforeRent: {
    type: String,
    required: true,
  },
  descriptionAfterRent: {
    type: String,
    required: true,
  },
  pictureBeforeRent: {
    type: String,
    required: true,
  },
  pictureAfterRent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeviceStatus = Mongoose.model("DeviceStatus", DeviceStatusSchema);
module.exports = DeviceStatus;
