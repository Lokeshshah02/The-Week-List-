const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
const userRouter = require('./Routes/userRoutes')
dotenv.config();

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require("./model/userSchema");
const errorhandler = require("./middleware/errorHandler");

app.get("/", (req, res) => {
  res.send("Welcome");
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

//getAll users api
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      status: "SUCCESS",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});



app.use('/user', userRouter);
app.use(errorhandler)


app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});

