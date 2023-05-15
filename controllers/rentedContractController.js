const RentedContract = require("../models/rentedContract");
const Device = require("../models/device");
const Offer = require("../models/offer");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createRentedContract = async (req, res) => {
  const  userId  = req.user.user.id;
  const { validFrom, validTo, price, device } = req.body;
  try {
    const deviceFound = await Device.findById(device);
    if (!deviceFound) {
      return res.status(404).json({ message: "Device not found" });
    }
    const newRentedContract = new RentedContract({
      validFrom,
      validTo,
      price,
      device,
      user: userId,
    });
    await newRentedContract.save();
    const newOffer = new Offer({
      RentedOffer: newRentedContract._id,
      salesman:deviceFound.user,
    });
    await newOffer.save();
    res.json(newRentedContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getRentedContracts = async (req, res) => {
  try {
    const rentedContracts = await RentedContract.find();
    res.json(rentedContracts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getRentedContractById = async (req, res) => {
  const rentedContractId = req.params.rentedContractId;
  try {
    const rentedContract = await RentedContract.findById(rentedContractId);
    if (!rentedContract) {
      return res.status(404).json({ message: "RentedContract not found" });
    }
    res.json(rentedContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteRentedContract = async (req, res) => {
  const  userId  = req.user.user.id;
  const rentedContractId = req.params.rentedContractId;
  try {
    const rentedContract = await RentedContract.findById(rentedContractId);
    if (!rentedContract) {
      return res.status(404).json({ message: "RentedContract not found" });
    }
    if (rentedContract.user != userId || req.user.user.role != "admin") {
      res.status(500).json({ message: "Not authorized to delete this rent" });
    }
    await rentedContract.remove();
    res.json({ message: "RentedContract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
