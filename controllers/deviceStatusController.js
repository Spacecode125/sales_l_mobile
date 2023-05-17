const DeviceStatus = require("../models/deviceStatus");
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
    try {
      const deviceStatus = await DeviceStatus.create({
        descriptionBeforeRent,
        descriptionAfterRent,
        pictureBeforeRent,
        pictureAfterRent,
        user: userId,
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

exports.getAllDevicesStausBySalesman = async (req, res, next) => {
  const userId = req.user.user.id;
  const deviceTest = await DeviceStatus.findById(deviceStatusId);
    if (deviceTest.user != userId || req.user.user.role != "admin") {
      res
        .status(500)
        .json({ message: "Not authorized to update this device status" });
    }
    if (!deviceTest) {
      res.status(500).json({ message: "No device status found" });
    }
  try {
    const deviceStatus = await DeviceStatus.find({ user: userId });;
    res.status(200).json(deviceStatus);
  } catch (error) {
    res.status(400).json({
      message: "No Device status found",
      error: error.message,
    });
  }
};

exports.getDeviceStatusById = async (req, res, next) => {
  try {
    const deviceStatus = await DeviceStatus.findById(req.params.id);
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
    const pictureBeforeRent =
      req.files.pictureBeforeRent?.[0]?.path || defaultImage;
    const pictureAfterRent =
      req.files.pictureAfterRent?.[0]?.path || defaultImage;
    const deviceTest = await DeviceStatus.findById(deviceStatusId);
    if (deviceTest.user != userId || req.user.user.role != "admin") {
      res
        .status(500)
        .json({ message: "Not authorized to update this device status" });
    }
    if (!deviceTest) {
      res.status(500).json({ message: "No device status found" });
    }
    if (req.file) {
      if (deviceTest.image) {
        fs.unlinkSync(deviceTest.image);
      }
      deviceTest.image = req.file.path;
    }
    try {
      const deviceStatus = await DeviceStatus.findByIdAndUpdate(
        deviceStatusId,
        {
          descriptionBeforeRent,
          descriptionAfterRent,
          pictureBeforeRent: pictureBeforeRent,
          pictureAfterRent: pictureAfterRent,
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
    if (deviceStatus.user != userId || req.user.user.role != "admin") {
      res
        .status(500)
        .json({ message: "Not authorized to delete this device status" });
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
