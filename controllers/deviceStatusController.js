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
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
    const { name, descriptionBeforeRent, descriptionAfterRent } = req.body;
    const pictureBeforeRent = req.file ? req.file.path : defaultImage;
    const pictureAfterRent = req.file ? req.file.path : defaultImage;
    try {
      const serial_number = await DeviceStatus.findOne({ serialNumber });
      if (serial_number) {
        return res.status(500).json({ message: "Duplicated serial number" });
      }
      const deviceStatus = await DeviceStatus.create({
        name,
        descriptionBeforeRent,
        descriptionAfterRent,
        pictureBeforeRent,
        pictureAfterRent,
      });
      res.status(201).json(deviceStatus);
    } catch (error) {
      res.status(400).json({
        message: "An error occured",
        error: error.message,
      });
    }
  });
};

exports.getDeviceStatusById = async (req, res, next) => {
  try {
    const deviceStatus = await DeviceStatus.findById(req.params.id);
    res.status(200).json(deviceStatus);
  } catch (error) {
    res.status(400).json({
      message: "No Device Status found",
      error: error.message,
    });
  }
};

exports.updateDeviceStatus = async (req, res, next) => {
  const { deviceStatusId } = req.params;
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
    const { name, descriptionBeforeRent, descriptionAfterRent } = req.body;
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
          name,
          descriptionBeforeRent,
          descriptionAfterRent,
          pictureBeforeRent,
          pictureAfterRent,
        }
      );
      res
        .status(200)
        .json({ deviceStatus, message: "Device Status successfully updated" });
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
    let deviceStatus = await DeviceStatus.findById(deviceStatusId);
    if (deviceStatus.image && deviceStatus.image !== "/uploads/info.png") {
      fs.unlink(deviceStatus.image, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    await DeviceStatus.findByIdAndDelete(deviceStatusId);
    res.status(200).json({
      message: "Device Status successfully deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: "No device status found to be deleted",
      error: error.message,
    });
  }
};
