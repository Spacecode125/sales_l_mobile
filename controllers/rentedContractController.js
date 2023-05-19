const RentedContract = require("../models/rentedContract");
const Device = require("../models/device");
const Offer = require("../models/offer");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createRentedContract = async (req, res) => {
  const  userId  = req.user.user.id;
  const { validFrom, validTo } = req.body; //body Request 
  const { deviceId } = req.params; 
  try {
    const deviceFound = await Device.findById(deviceId);
    if (!deviceFound) {
      return res.status(404).json({ message: "Device not found" });
    }
    // Calculate the number of days rented
    const fromDate = new Date(validFrom);
    const toDate = new Date(validTo);
    const rentalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
    console.log(rentalDays);
    const owner = deviceFound.user;
    
    // Calculate the total price based on the rental days
    const totalPrice = rentalDays * deviceFound.rentalPrice;
    const newRentedContract = new RentedContract({
      validFrom,
      validTo,
      total: totalPrice,
      device:deviceId,
      client: userId,
      owner
    });
    await newRentedContract.save();
    const newOffer = new Offer({
      RentedOffer: newRentedContract._id,
      salesman:deviceFound.user,
      client:userId
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

exports.getAllRentedContractsBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  try {
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ owner: userId }, { "user.role": "admin" }],
      };
    }

    const rentedContracts = await RentedContract.find(query).populate("device").populate("client").populate("owner");
    if (rentedContracts) {
      res.status(200).json(rentedContracts);
    } else {
      res
        .status(500)
        .json({ message: "Not authorized to get these rented contracts" });
    }
  } catch (error) {
    res.status(400).json({
      message: "No rented contracts status found",
      error: error.message,
    });
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
    const userRole = req.user.user.role;
    let query = {};
  
    if (userRole !== "admin") {
      query = {
        $or: [
          { owner: userId },
          { "user.role": "admin" }
        ]
      };
    }
    const RentedContractAuth = await RentedContract.find(query);
    if (!RentedContractAuth) {
      res.status(500).json({ message: "Not authorized to delete this rent" });
    }
    await rentedContract.remove();
    res.json({ message: "RentedContract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
