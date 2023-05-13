const express = require("express");
const app = express();
const connectDB = require("./db/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
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

app.use(cookieParser());
app.use("/api/user", require("./routes/authRoutes"));
app.use(authRoutes);

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
