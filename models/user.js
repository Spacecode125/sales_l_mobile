const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "salesman"],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: "/uploads/info.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = Mongoose.model("User", UserSchema);
module.exports = User;
