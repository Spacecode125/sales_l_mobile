const Mongoose = require("mongoose");
const RentedContractSchema = new Mongoose.Schema({
  validFrom: {
    type: Date,
    required: true,
    default: Date.now,
  },
  validTo: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  device: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  client: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Waiting", "Rented"],
    default: "Waiting",
  },
});

const RentedContract = Mongoose.model("RentedContract", RentedContractSchema);
module.exports = RentedContract;
