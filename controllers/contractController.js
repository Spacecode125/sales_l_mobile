const Contract = require("../models/contract");
const RentedContractModel = require("../models/rentedContract");
const TradedContractModel = require("../models/tradedContract");

const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createContract = async (req, res) => {
  const {
    reference,
    signedbyOwner,
    signedbyPartner,
    rentedContractId,
    tradedContractId,
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
        signedbyOwner,
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
        signedbyOwner,
        signedbyPartner,
        TradedContract: tradedContractId,
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
