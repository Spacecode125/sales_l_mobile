const Offer = require("../models/offer");
const RentedContractModel = require("../models/rentedContract");
const TradedContractModel = require("../models/tradedContract");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.getAllOffers = async (req, res) => {
  try {
    const offer = await Offer.find()
      .populate({
        path: "RentedOffer",
        populate: {
          path: "device",
          model: "Device",
        },
      })
      .populate({
        path: "TradedOffer",
        populate: [
          {
            path: "tradeInOffer",
            model: "Device",
          },
          {
            path: "tradedDevice",
            model: "Device",
          },
        ],
      })
      .populate({
        path: "PurchaseOffer",
        populate: [
          {
            path: "device",
            model: "Device",
          },
          {
            path: "owner",
            model: "User",
          },
          {
            path: "client",
            model: "User",
          },
        ],
      });
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllOffersBySalesman = async (req, res) => {
  const userId = req.user.user.id;
console.log(userId)
  try {
    const offer = await Offer.find({ salesman: userId });
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
