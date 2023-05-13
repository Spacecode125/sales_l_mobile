const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
const multer = require("multer");
const multerStorage = require('../middleware/multerStorage');

const upload = multer({ storage: multerStorage });
exports.register = async (req, res) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server Error");
        }
    
        const { email, role, firstName, lastName, address, password } = req.body;
        const image = req.file.path; // Access the full path of the uploaded file from req.file
    
        try {
          const user = await User.findOne({ email });
          if (user) {
            return res.status(400).json({ message: "User already exists" });
          }
    
          const newUser = new User({
            email,
            role,
            firstName,
            lastName,
            address,
            password,
            image,
          });
    
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(password, salt);
          await newUser.save();
    
          const payload = {
            user: {
              id: newUser._id,
              role: newUser.role,
            },
          };
    
          jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.cookie("jwt", token, { httpOnly: true, maxAge: 360000 });
              res.json({ token });
            }
          );
        } catch (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        }
      });
    };

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the stored password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.cookie("jwt", token, { httpOnly: true, maxAge: 360000 });
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };

  exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };

  exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, firstName, lastName, address } = req.body;
  
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.address = address;
  
      await user.save();
      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  // Delete user
  exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await user.remove();
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };