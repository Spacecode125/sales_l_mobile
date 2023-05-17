const PurchaseContract = require("../models/purchaseContract");
const Device = require("../models/device");
const Offer = require("../models/offer");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

exports.createPurchaseContract = async (req, res) => {
  const userId = req.user.user.id;
  const { deviceId } = req.params;
  try {
    const deviceFound = await Device.findById(deviceId);
    if (!deviceFound) {
      return res.status(404).json({ message: "Device not found" });
    }
    // Calculate the total price based on the rental days
    const price = deviceFound.purchacePrice;
    const owner = deviceFound.user;
    const newPurchaseContract = new PurchaseContract({
      price,
      device: deviceId,
      client: userId,
      owner,
    });
    await newPurchaseContract.save();
    const newOffer = new Offer({
      PurchaseOffer: newPurchaseContract._id,
      salesman: deviceFound.user,
      client: userId,
    });
    await newOffer.save();
    res.json(newPurchaseContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPurchaseContracts = async (req, res) => {
  try {
    const purchaseContracts = await PurchaseContract.find();
    res.json(purchaseContracts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllPurchaseContractsBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  try {
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ owner: userId }, { "user.role": "admin" }],
      };
    }

    const purchaseContracts = await PurchaseContract.find(query).populate("device").populate("client").populate("owner");
    if (purchaseContracts) {
      res.status(200).json(purchaseContracts);
    } else {
      res
        .status(500)
        .json({ message: "Not authorized to get these purchase contracts" });
    }
  } catch (error) {
    res.status(400).json({
      message: "No purchase contracts status found",
      error: error.message,
    });
  }
};

exports.getPurchaseContractById = async (req, res) => {
  const purchaseContractId = req.params.purchaseContractId;
  try {
    const purchaseContract = await PurchaseContract.findById(
      purchaseContractId
    );
    if (!purchaseContract) {
      return res.status(404).json({ message: "Purchase contract not found" });
    }
    res.json(purchaseContract);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.cancelPurchaseContract = async (req, res) => {
  const userId = req.user.user.id;
  const purchaseContractId = req.params.purchaseContractId;
  try {
    const purchaseContract = await PurchaseContract.findById(
      purchaseContractId
    );
    if (!purchaseContract) {
      return res.status(404).json({ message: "Purchase contract not found" });
    }
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ user: userId }, { "user.role": "admin" }],
      };
    }
    const PurchaseContractAuth = await PurchaseContract.find(query);
    if (!PurchaseContractAuth) {
      res.status(500).json({ message: "Not authorized to delete this rent" });
    }
    await purchaseContract.remove();
    res.json({ message: "Purchase contract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.acceptPurchaseContract = async (req, res) => {
  const userId = req.user.user.id;
  const purchaseContractId = req.params.purchaseContractId;
  try {
    const purchaseContract = await PurchaseContract.findById(
      purchaseContractId
    );
    if (!purchaseContract) {
      return res.status(404).json({ message: "Purchase contract not found" });
    }
    const userRole = req.user.user.role;
    let query = {};

    if (userRole !== "admin") {
      query = {
        $or: [{ owner: userId }, { "user.role": "admin" }],
      };
    }
    const PurchaseContractAuth = await PurchaseContract.find(query);
    if (!PurchaseContractAuth) {
      res.status(500).json({ message: "Not authorized to delete this rent" });
    }
    if (purchaseContract.device) {
      const device = await Device.findById(purchaseContract.device);
      if (device) {
        await device.remove();
      }
    }
    await purchaseContract.remove();
    res.json({ message: "Purchase contract deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
