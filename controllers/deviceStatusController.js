const DeviceStatus = require("../models/deviceStatus");
const RentedContract = require("../models/rentedContract");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
const multer = require("multer");
const multerStorage = require("../middleware/multerStorage");
const defaultImage = "uploads/info.png";
const upload = multer({ storage: multerStorage });
const fs = require("fs");

exports.addDeviceStatus = async (req, res, next) => {
  const userId = req.user.user.id;
  upload.fields([
    { name: "pictureBeforeRent", maxCount: 1 },
    { name: "pictureAfterRent", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    const { descriptionBeforeRent, descriptionAfterRent } = req.body;
    const pictureBeforeRent =
      req.files.pictureBeforeRent?.[0]?.path || defaultImage;
    const pictureAfterRent =
      req.files.pictureAfterRent?.[0]?.path || defaultImage;
    const RentedContractId = req.params.RentedContractId;
    const RentFound = await RentedContract.findById(RentedContractId);
    if (!RentFound) {
      res.status(500).json({ message: "No Rent found" });
    }
    try {
      const deviceStatus = await DeviceStatus.create({
        descriptionBeforeRent,
        descriptionAfterRent,
        pictureBeforeRent,
        pictureAfterRent,
        user: userId,
        RentedContract: RentedContractId,
      });
      res.status(201).json(deviceStatus);
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAllDevicesStatusBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  try {
    const userRole = req.user.user.role;
    let query = {};
  
    if (userRole !== "admin") {
      query = {
        $or: [
          { user: userId },
          { "user.role": "admin" }
        ]
      };
    }

    const deviceStatus = await DeviceStatus.find(query);
    if (deviceStatus) {
      res.status(200).json(deviceStatus);
    } else {
      res
        .status(500)
        .json({ message: "Not authorized to get this device status" });
    }
  } catch (error) {
    res.status(400).json({
      message: "No Device status found",
      error: error.message,
    });
  }
};

exports.getDeviceStatusById = async (req, res, next) => {
  const { deviceStatusId } = req.params;
  try {
    const deviceStatus = await DeviceStatus.findById(deviceStatusId);
    res.status(200).json(deviceStatus);
  } catch (error) {
    res.status(400).json({
      message: "No device status found",
      error: error.message,
    });
  }
};

exports.updateDeviceStatus = async (req, res, next) => {
  const { deviceStatusId } = req.params;
  const userId = req.user.user.id;
  upload.fields([
    { name: "pictureBeforeRent", maxCount: 1 },
    { name: "pictureAfterRent", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    const { descriptionBeforeRent, descriptionAfterRent } = req.body;
    const deviceTest = await DeviceStatus.findById(deviceStatusId);
    if (!deviceTest) {
      res.status(500).json({ message: "No device status found" });
    }
    const userRole = req.user.user.role;
    let query = {};
  
    if (userRole !== "admin") {
      query = {
        $or: [
          { user: userId },
          { "user.role": "admin" }
        ]
      };
    }
    const deviceStatusAuth = await DeviceStatus.find(query);
    if (!deviceStatusAuth) { 
      res.status(500).json({ message: "Not authorized to update this device Status" });
    }
    
    if (req.files.pictureBeforeRent?.[0]?.path) {
      if (deviceTest.pictureBeforeRent) {
        fs.unlinkSync(deviceTest.pictureBeforeRent);
      }
      deviceTest.pictureBeforeRent = req.files.pictureBeforeRent?.[0]?.path;
    }
    if (req.files.pictureAfterRent?.[0]?.path) {
      if (deviceTest.pictureAfterRent) {
        fs.unlinkSync(deviceTest.pictureAfterRent);
      }
      deviceTest.pictureAfterRent = req.files.pictureBeforeRent?.[0]?.path;
    }
    try {
      const deviceStatus = await DeviceStatus.findByIdAndUpdate(
        deviceStatusId,
        {
          descriptionBeforeRent,
          descriptionAfterRent,
          pictureBeforeRent: deviceTest.pictureBeforeRent,
          pictureAfterRent: deviceTest.pictureAfterRent,
        }
      );
      res
        .status(200)
        .json({ deviceStatus, message: "Device status successfully updated" });
    } catch (error) {
      res.status(400).json({
        message: "No device status found",
        error: error.message,
      });
    }
  });
};

exports.deleteDeviceStatus = async (req, res, next) => {
  try {
    const { deviceStatusId } = req.params;
    const userId = req.user.user.id;
    let deviceStatus = await DeviceStatus.findById(deviceStatusId);
    const userRole = req.user.user.role;
    let query = {};
  
    if (userRole !== "admin") {
      query = {
        $or: [
          { user: userId },
          { "user.role": "admin" }
        ]
      };
    }
    const deviceStatusAuth = await DeviceStatus.find(query);
    if (!deviceStatusAuth) { 
      res.status(500).json({ message: "Not authorized to delete this device Status" });
    }
    if (deviceStatus.image && deviceStatus.image !== "/uploads/info.png") {
      fs.unlink(deviceStatus.image, (err) => {
        if (err) {
          res.status(500).json({
            message: "Device status image not found",
          });
        }
      });
    }
    await DeviceStatus.findByIdAndDelete(deviceStatusId);
    res.status(200).json({
      message: "Device status successfully deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: "No device status found to be deleted",
      error: error.message,
    });
  }
};
