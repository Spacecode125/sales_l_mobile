const Mongoose = require("mongoose");
const ContractSchema = new Mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  signedbyOwner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  signedbyPartner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  RentedContract: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "RentedContract",
  },
  TradedContract: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "TradedContract",
  },
  PurchaseContract: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "PurchaseContract",
  },
  type : {
    type: String,
    enum: ["Rental", "Trade", "Purchase"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contract = Mongoose.model("Contract", ContractSchema);
module.exports = Contract;
