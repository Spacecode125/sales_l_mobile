const RentedContract = require("../models/rentedContract");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createRentedContract = async (req, res) => {
  const { validFrom, validTo, price } = req.body;
  try {
    const newRentedContract = new RentedContract({
      validFrom,
      validTo,
      price,
    });
    await newRentedContract.save();
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
  const rentedContractId = req.params.rentedContractId;
  try {
    const rentedContract = await RentedContract.findById(rentedContractId);
    if (!rentedContract) {
      return res.status(404).json({ message: "RentedContract not found" });
    }
    await rentedContract.remove();
    res.json({ message: "RentedContract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
