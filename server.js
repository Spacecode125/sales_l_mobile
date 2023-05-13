const express = require("express");
const app = express();
const connectDB = require("./db/db");
const cors = require("cors");

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
// app.get(userAuth, (req, res) => res.send("User Route"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});