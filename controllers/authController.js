const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
const multer = require("multer");
const multerStorage = require("../middleware/multerStorage");
const fs = require("fs");
const defaultImage = "uploads\\info.png";

const upload = multer({ storage: multerStorage });
exports.register = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }

    const {
      email,
      role,
      firstName,
      lastName,
      phone,
      address,
      about,
      password,
    } = req.body;
    const image = req.file ? req.file.path : defaultImage; // Access the full path of the uploaded file from req.file
    const allowedRoles = ["user", "salesman"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
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
        phone,
        address,
        password,
        about,
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

      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.cookie("jwt", token, { httpOnly: true, maxAge: 360000 });
        res.json({ token, newUser });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        message: "Server error",
      });
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
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "users not found",
    });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "user not found",
    });
  }
};

exports.updateUser = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }

    const userId = req.user.user.id;
    const { about, firstName, lastName, phone, address } = req.body;

    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone;
      user.address = address;
      user.about = about;

      if (req.file) {
        console.log(user.image);
        if (user.image !== "uploads\\info.png") {
          fs.unlinkSync(user.image);
        }

        user.image = req.file.path;
      }

      await user.save();
      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  });
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.image)
    if (user.image) {
      if (user.image !== "uploads\\info.png") {
        // Delete the user's image file from the server
        fs.unlink(user.image, (err) => {
          if (err) {
            res.status(500).json({
              message: "Device image not found",
            });
          }
        });
      }
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

exports.findEmail = async (req, res) => {
  const { email } = req.body;

  // Look up the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({message:'User not found'});
  }

  res.json({ userId: user._id });
}

exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
try{

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({message:'User not found'});
  }


  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    return res.status(400).json({message:'New password cannot be the same as the current password'});
  }


  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);


  user.password = passwordHash;
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token,user });}
  catch(err){
    console.log(err)
  }
}