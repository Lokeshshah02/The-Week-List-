const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId : {
      type: String,
      require: true,
     },
    fullName: {
      type: String,
      required: [true, "Please add the user full name"],
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the password"],
    },
    age: {
      type: Number,
      required: [true, "Please add the number"],
    },
    gender: {
      type: String,
      required: [true, "Please add the gender"],
    },
    mobile: {
       type: Number, 
       required: [true, "Please add the user number"] 
      },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema);
