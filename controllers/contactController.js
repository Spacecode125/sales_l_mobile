const Contact = require("../models/contact");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const transporter = require("../middleware/email");

exports.createContact = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({
      name,
      email,
      message,
    });
    await newContact.save();
    const mailOptions = {
      from: email, // Replace with your Gmail address
      to: "khaledbouajila5481@gmail.com", // Replace with the recipient's email address
      subject: "New Contact",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    await transporter.sendMail(mailOptions);
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
