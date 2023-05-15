const Mongoose = require("mongoose");
const OfferSchema = new Mongoose.Schema({
  RentedOffers: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "RentedContract",
  },
  TradedOffers: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "TradedContract",
  },
});

const Offer = Mongoose.model("Offer", OfferSchema);
module.exports = Offer;
