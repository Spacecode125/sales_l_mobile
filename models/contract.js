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
});

const Contract = Mongoose.model("Contract", ContractSchema);
module.exports = Contract;
