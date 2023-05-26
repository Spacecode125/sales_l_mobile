const Mongoose = require("mongoose");
const ContactSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  subject : {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});
const Contact = Mongoose.model("Contact", ContactSchema);
module.exports = Contact;
