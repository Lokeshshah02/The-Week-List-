const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");

dotenv.config()

const User = require("../model/userSchema");

const signUp = asyncHandler ( async (req, res) => {
    try {
      console.log("Received signup request:", req.body);
      const { fullName, email, password, age, gender, mobile } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: "FAILED",
          message: "Email is already registered",
        });
      }
  
      // Create a new user
      const newUser = new User({
        fullName,
        email,
        password: encryptedPassword,
        age,
        gender,
        mobile,
      });
      await newUser.save();
      console.log("User saved:", newUser);
      res.json({
        status: "SUCCESS",
        message: "You've signed up successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "FAILED",
        message: "Oops! Something went wrong.",
      });
    }
  });

const logIn = asyncHandler (async (req, res) => {
  console.log("Received login request:", req.body);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        let hasPasswordMatched = await bcrypt.compare(password, user.password);
  
        if (hasPasswordMatched) {
          const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 300,
          });
          res.json({
            status: "SUCCESS",
            message: "You've logged In successfully!",
            jwtToken,
          });
        } else {
          res.json({
            status: "FAILED",
            message: "Oops! wrong credentials.",
          });
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No User Found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "FAILED",
        message: "Oops! Something went wrong.",
      });
    }
  });
  

const currentUser = asyncHandler (async (req, res) => {
    res.json({ message : 'Current in user'})
})



module.exports = { signUp , logIn, currentUser}