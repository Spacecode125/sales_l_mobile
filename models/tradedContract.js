const Mongoose = require("mongoose");
const TradedContractSchema = new Mongoose.Schema({
  tradeInOffer: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  tradedDevice: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
});

const TradedContract = Mongoose.model("TradedContract", TradedContractSchema);
module.exports = TradedContract;
