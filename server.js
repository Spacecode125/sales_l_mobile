const express = require("express");
const app = express();
const connectDB = require("./db/db");
const cors = require("cors");
const { roleAuth } = require("./middleware/auth");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
server = app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
app.use("/api/uploads", express.static("uploads"));
app.use("/api/user", require("./routes/authRoutes"));
app.use("/api/contract", require("./routes/contractRoutes"));
app.use("/api/rentedContract", require("./routes/rentedContractRoutes"));
app.use("/api/tradedContract", require("./routes/tradedContractRoutes"));
app.use("/api/device", require("./routes/deviceRoutes"));
app.use("/api/offer", require("./routes/offerRoutes"));
app.use("/api/deviceStatus", require("./routes/deviceStatusRoutes"));


app.get("/adminRoute", roleAuth("admin"), (req, res) => {
  res.send("Authenticated Route for Admin");
});
app.get("/salesmanRoute", roleAuth(["salesman"]), (req, res) => {
  res.send("Authenticated Route for Salesman");
});

app.get("/userRoute", roleAuth(["user"]), (req, res) => {
  res.send("Authenticated Route for User");
});
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
