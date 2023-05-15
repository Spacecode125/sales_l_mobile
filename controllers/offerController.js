const Offer = require("../models/offer");
const RentedContractModel = require("../models/rentedContract");
const TradedContractModel = require("../models/tradedContract");

const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());


exports.getAllOffers = async (req, res) => {
  try {
    const offer = await Contract.find()
      .populate("RentedContract")
      .populate({
        path: "TradedContract",
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
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};


