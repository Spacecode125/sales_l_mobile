const Mongoose = require("mongoose");
const DeviceSchema = new Mongoose.Schema({
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  purchacePrice: {
    type: Number,
    required: true,
  },
  rentalPrice: {
    type: Number,
    required: true,
  },
  yearOfManufacture: {
    type: Date,
    required: true,
  },
  deviceStatus: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "DeviceStatus",
  },
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = Mongoose.model("Device", DeviceSchema);
module.exports = Device;
