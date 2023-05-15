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
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
});

const TradedContract = Mongoose.model("TradedContract", TradedContractSchema);
module.exports = TradedContract;
