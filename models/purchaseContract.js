const Mongoose = require("mongoose");
const PurchaseContractSchema = new Mongoose.Schema({
  device: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  price: {
    type: Number,
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
    enum: ["En attent", "Acheter"],
    default: "En attent",
  },
});

const PurchaseContract = Mongoose.model(
  "PurchaseContract",
  PurchaseContractSchema
);
module.exports = PurchaseContract;
