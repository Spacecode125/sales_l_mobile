const Contract = require("../models/contract");
const RentedContractModel = require("../models/rentedContract");
const TradedContractModel = require("../models/tradedContract");
const PurchaseContractModel = require("../models/purchaseContract");

const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createContract = async (req, res) => {
  const userId = req.user.user.id;
  const {
    reference,
    signedbyPartner,
    rentedContractId,
    tradedContractId,
    purchaseContractId,
  } = req.body;
  try {
    let newContract;
    if (rentedContractId) {
      const rentedContract = await RentedContractModel.findById(
        rentedContractId
      );
      if (!rentedContract) {
        return res.status(400).json({ message: "Invalid rented contract ID" });
      }
      newContract = new Contract({
        reference,
        signedbyOwner:userId,
        signedbyPartner,
        RentedContract: rentedContractId,
      });
    } else if (tradedContractId) {
      const tradedContract = await TradedContractModel.findById(
        tradedContractId
      );
      if (!tradedContract) {
        return res.status(400).json({ message: "Invalid traded contract ID" });
      }
      newContract = new Contract({
        reference,
        signedbyOwner:userId,
        signedbyPartner,
        TradedContract: tradedContractId,
      });
    } else if (purchaseContractId) {
      const purchaseContract = await PurchaseContractModel.findById(
        purchaseContractId
      );
      if (!purchaseContract) {
        return res.status(400).json({ message: "Invalid traded contract ID" });
      }
      newContract = new Contract({
        reference,
        signedbyOwner:userId,
        signedbyPartner,
        PurchaseContract: purchaseContractId,
      });
    } else {
      return res.status(400).json({ message: "No contract ID provided" });
    }

    await newContract.save();
    res.json(newContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate({
        path: "RentedContract",
        populate: {
          path: "device",
          model: "Device",
        },
      })
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
      .populate({
        path: "PurchaseContract",
        populate: {
          path: "device",
          model: "Device",
        },
      })
      .populate("signedbyOwner")
      .populate("signedbyPartner");
    res.json(contracts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getContractByReference = async (req, res) => {
  const reference = req.params.reference;
  try {
    const contract = await Contract.findOne({ reference });
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json(contract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllContractsBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  try {
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ signedbyOwner: userId }, { "user.role": "admin" }],
      };
    }

    const contracts = await Contract.find(query)
      .populate("signedbyOwner")
      .populate("signedbyPartner")
      .populate({
        path: "RentedContract",
        populate: {
          path: "device",
          model: "Device",
        },
      })
      .populate({
        path: "TradedContract",
        populate: {
          path: "tradedDevice",
          model: "Device",
        },
      })
      .populate({
        path: "PurchaseContract",
        populate: {
          path: "device",
          model: "Device",
        },
      });
    if (contracts) {
      res.status(200).json(contracts);
    } else {
      res
        .status(500)
        .json({ message: "Not authorized to get these contracts" });
    }
  } catch (error) {
    res.status(400).json({
      message: "No contracts found",
      error: error.message,
    });
  }
};

exports.deleteContract = async (req, res) => {
  const reference = req.params.reference;
  try {
    const contract = await Contract.findOne({ reference });
    if (!contract) {
      return res
        .status(404)
        .json({ message: "Contract not found with this reference" });
    }
    await contract.remove();
    res.json({ message: "Contract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
