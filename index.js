const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const User = mongoose.model('user', {
  fullName: String,
  email: String,
  password: String,
});

app.get("/", (req, res) => {
  res.send("bolo");
});

//Health Api
app.get("/health", (req, res) => {
  try {
    const serverName = "Week List";
    const currentTime = new Date().toLocaleString();
    const serverStatus = "active";

    const healthInfo = {
      serverName,
      currentTime,
      serverStatus,
    };
    res.json(healthInfo);
  } catch (error) {
    res.json({
      status: "Not Active",
      message: "Something went wrong",
    });
  }
});

//signUp

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    await User.create({fullName, email, password})
    res.json({
      status: "SUCCESS",
      message: "You've signed in successfully!",
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: " OOPS Wrong Credentials!",
    });
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});
