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

const upload = multer({ storage: multerStorage });

exports.addDevice = async (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
    const {
      description,
      brand,
      type,
      serialNumber,
      purchacePrice,
      yearOfManufacture,
      createdAt,
    } = req.body;
    const image = req.file.path;
    try {
      const device = await Device.create({
        description,
        type,
        brand,
        serialNumber,
        image,
        purchacePrice,
        yearOfManufacture,
        createdAt,
      });
      res.status(201).json(
        device,
      );
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
    res.status(200).json(
      device,
    );
  } catch (error) {
    res.status(400).json({
      message: "No Device found",
      error: error.message,
    });
  }
};

exports.getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({});
    res.status(200).json({
      devices,
    });
  } catch (error) {
    res.status(400).json({
      message: "No Devices found",
      error: error.message,
    });
  }
};

exports.updateDevice = async (req, res, next) => {
  const { deviceId } = req.params;
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
    const {
      description,
      brand,
      type,
      serialNumber,
      purchacePrice,
      yearOfManufacture,
    } = req.body;
    try {
      const devices = await Device.findByIdAndUpdate(deviceId, {
        description,
        brand,
        type,
        serialNumber,
        image,
        purchacePrice,
        yearOfManufacture,
      });
      res
        .status(200)
        .json({ devices, message: "devices successfully updated" });
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
    const devices = await Device.findByIdAndDelete(deviceId);
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
