const Device = require("../models/device");
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

exports.addDevice = async (req, res, next) => {
  const { userId } = req.user.user.id;
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    const {
      description,
      brand,
      type,
      serialNumber,
      purchacePrice,
      yearOfManufacture,
    } = req.body;
    const image = req.file ? req.file.path : defaultImage;
    try {
      const serial_number = await Device.findOne({ serialNumber });
      if (serial_number) {
        return res.status(500).json({ message: "Duplicated serial number" });
      }
      const device = await Device.create({
        description,
        type,
        brand,
        serialNumber,
        image,
        purchacePrice,
        yearOfManufacture,
        user: userId,
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(400).json({
        message: "An error occured",
        error: error.message,
      });
    }
  });
};

exports.getDeviceById = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    res.status(200).json(device);
  } catch (error) {
    res.status(400).json({
      message: "No Device found",
      error: error.message,
    });
  }
};

exports.getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(400).json({
      message: "No Devices found",
      error: error.message,
    });
  }
};

exports.updateDevice = async (req, res, next) => {
  const { deviceId } = req.params;
  const { userId } = req.user.user.id;
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    const {
      description,
      brand,
      type,
      serialNumber,
      purchacePrice,
      yearOfManufacture,
    } = req.body;
    const deviceTest = await Device.findById(deviceId);
    if (deviceTest.user != userId || req.user.user.role != "admin") {
      res.status(500).json({ message: "Not authorized to update this device" });
    }
    if (!deviceTest) {
      res.status(500).json({ message: "No device found" });
    }
    if (req.file) {
      if (deviceTest.image) {
        fs.unlinkSync(deviceTest.image);
      }
      deviceTest.image = req.file.path;
    }
    try {
      const device = await Device.findByIdAndUpdate(deviceId, {
        description,
        brand,
        type,
        serialNumber,
        image: deviveTest.image,
        purchacePrice,
        yearOfManufacture,
      });
      res.status(200).json({ device, message: "devices successfully updated" });
    } catch (error) {
      res.status(400).json({
        message: "No device found",
        error: error.message,
      });
    }
  });
};

exports.deleteDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { userId } = req.user.user.id;
    let device = await Device.findById(deviceId);
    if (device.user != userId || req.user.user.role != "admin") {
      res.status(500).json({ message: "Not authorized to delete this device" });
    }
    if (device.image && device.image !== "/uploads/info.png") {
      fs.unlink(device.image, (err) => {
        if (err) {
          res.status(500).json({
            message: "Device image not found",
          });
        }
      });
    }
    await Device.findByIdAndDelete(deviceId);
    res.status(200).json({
      message: "Device successfully deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: "No device found to be deleted",
      error: error.message,
    });
  }
};
