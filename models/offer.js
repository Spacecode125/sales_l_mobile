const Mongoose = require("mongoose");
const OfferSchema = new Mongoose.Schema({
  RentedOffer: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "RentedContract",
  },
  TradedOffer: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "TradedContract",
  },
  PurchaseOffer: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "PurchaseContract",
  },
  salesman: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  client: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Offer = Mongoose.model("Offer", OfferSchema);
module.exports = Offer;
