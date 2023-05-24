const TradedContract = require("../models/tradedContract");
const Offer = require("../models/offer");
const Device = require("../models/device");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createTradedContract = async (req, res) => {
  const userId = req.user.user.id;
  const { tradeInOffer, tradedDevice } = req.body;
  try {
    const deviceFound = await Device.findById(tradedDevice);
    const owner = deviceFound.user;
    const newTradedContract = new TradedContract({
      tradeInOffer,
      tradedDevice,
      client: userId,
      owner,
    });
    await newTradedContract.save();
    const newOffer = new Offer({
      TradedOffer: newTradedContract._id,
      salesman: deviceFound.user,
      client: userId,
      createdAt: new Date(),
      type: "Trade",
    });
    await newOffer.save();
    res.json(newTradedContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTradedContracts = async (req, res) => {
  try {
    const tradedContracts = await TradedContract.find().populate({
      path: "tradedDevice",
      populate: { path: "user" },
    })
    .populate({
      path: "tradeInOffer",
      populate: { path: "user" },
    })
    .populate("client")
    .populate("owner");;
    res.json(tradedContracts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTradedContractById = async (req, res) => {
  const tradedContractId = req.params.tradedContractId;
  try {
    const tradedContract = await TradedContract.findById(tradedContractId);
    if (!tradedContract) {
      return res.status(404).json({ message: "TradedContract not found" });
    }
    res.json(tradedContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllTradedContractsBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  try {
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ owner: userId }, { "user.role": "admin" }],
      };
    }

    const tradedContracts = await TradedContract.find(query)
      .populate({
        path: "tradedDevice",
        populate: { path: "user" },
      })
      .populate({
        path: "tradeInOffer",
        populate: { path: "user" },
      })
      .populate("client")
      .populate("owner");
    if (tradedContracts) {
      res.status(200).json(tradedContracts);
    } else {
      res
        .status(500)
        .json({ message: "Not authorized to get these traded contracts" });
    }
  } catch (error) {
    res.status(400).json({
      message: "No traded contracts status found",
      error: error.message,
    });
  }
};

exports.deleteTradedContract = async (req, res) => {
  const userId = req.user.user.id;
  const tradedContractId = req.params.tradedContractId;
  try {
    const tradedContract = await TradedContract.findById(tradedContractId);
    if (!tradedContract) {
      return res.status(404).json({ message: "TradedContract not found" });
    }
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ owner: userId }, { "user.role": "admin" }],
      };
    }
    const TradedContractAuth = await TradedContract.find(query);
    if (!TradedContractAuth) {
      res.status(500).json({ message: "Not authorized to delete this trade" });
    }
    await tradedContract.remove();
    res.json({ message: "TradedContract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
