const Mongoose = require("mongoose");
const DeviceStatusSchema = new Mongoose.Schema({
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
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  RentedContract: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "RentedContract",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeviceStatus = Mongoose.model("DeviceStatus", DeviceStatusSchema);
module.exports = DeviceStatus;
