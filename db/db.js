const mongoose = require("mongoose");

const localDB = "mongodb+srv://khaledbouajila5481:khaled99@cluster0.ymwoyla.mongodb.net/";
const connectDB = async () => {
  await mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB