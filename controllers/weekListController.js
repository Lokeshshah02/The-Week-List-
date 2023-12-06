const asyncHandler = require("express-async-handler");
const WeekList = require("../model/weekListModel");
const User = require('../model/userSchema')
// const isLoggedIn = require('../middleware/validateUser');
const cron = require("node-cron");
const mongoose = require("mongoose");

// API to Add week List
const weekList = asyncHandler(async (req, res) => {
  try {
    const { userId, weekTask, isCompleted } = req.body;

    // Assuming you have the userId of the logged-in user
    // const userId = req.user._id;

    //correction check for the schedule time to create again

    // Check if the user has less than two active week lists
    const activeWeekLists = await WeekList.countDocuments({
      userId,
      isCompleted: false,
    });
    console.log(activeWeekLists);
    if (activeWeekLists < 2) {
      const newWeekList = new WeekList({
        userId,
        weekTask,
        isCompleted,
      });

      // Save the WeekList
      await newWeekList.save();

      // Schedule a timer for 7 days (604800 seconds)
      cron.schedule(
        `*/1 * * * *`,
        () => {
          const now = new Date();
          const createdDate = new Date(newWeekList.createdAt);
          const elapsedTime = now - createdDate;
          const remainingTime = 7 * 24 * 60 * 60 * 1000 - elapsedTime;

          const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
          const hours = Math.floor(
            (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
          );
          const minutes = Math.floor(
            (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
          );
          const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

          console.log(
            `${days}d:${hours}hr:${minutes}m:${seconds}sec remaining`
          );
        },
        {
          scheduled: true,
          timezone: "UTC",
        }
      );

      console.log("Weeklist created:", newWeekList);
      res.json({
        status: "Success",
        message: "Weeklist created successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "You can have only two active week lists at a time.",
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});

// API to Update Week List Api
const updateList = asyncHandler(async (req, res) => {
  try {
    const { userId, isMarked } = req.body;
    const { id } = req.query;
    console.log("id", id);
    const filter = {
      _id: id,
      userId: userId,
      "weekTask.tasks": {
        $elemMatch: {
          isMarked: isMarked,
        },
      },
    };
    const update = req.body;
    const options = { new: true };
    const updatedDocument = await WeekList.findByIdAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedDocument) {
      // If no document was found, return an error response
      return res
        .status(404)
        .json({ error: "List not found or user not found in the list" });
    }

    res.status(200).json({ message: "Updated successfully", updatedDocument });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//API to get  All the week List in the DataBase
const allWeekList = asyncHandler(async (req, res) => {
  try {
    const weekList = await WeekList.find({});
    res.status(200).json({ message: "SUCCESS", data: weekList });
  } catch (err) {
    res.status(400).json({ error: "Something went wrong!!" });
  }
});

// API to Delete week List

const deleteWeekListTasksById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("find userid", userId)

    const { id } = req.query;
    console.log("find id", id)

    const weekList = await WeekList.findById({_id:id});

    if (!weekList) {
      return res.status(404).json({ error: "WeekList not found" });
    }

    if (weekList.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You don't have permission to delete this WeekList" });
    }

    const timeDifference = new Date() - weekList.timeCreated;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference <= 24) {
      await WeekList.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted the WeekList successfully" });
    } else {
      return res.status(403).json({
        error: "You can only delete the WeekList within 24 hours of creation",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Can't delete tasks, something went wrong!" });
  }
});


//Delete WeekList
const deleteWeekList = asyncHandler(async(req, res) =>{
  try{
    const {id} = req.query
    await WeekList.findByIdAndDelete(id)
    res.status(200).json({message : "Deleteted the weeklist successfully"})

  }catch (err) {
    res.status(400).json({ error: "Can't delete something went wrong!!"})
  }
})

//API to get weeklist by userid
const getWeekListById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await WeekList.findOne(id);
    res.status(200).json({ message: "Weeklists of the user successfully" });
  } catch (err) {
    res.status(400).json({ error: "Can't get the details of the user" });
  }
});
//API to get weeklist of active (only)

module.exports = {
  weekList,
  allWeekList,
  updateList,
  deleteWeekList,
  getWeekListById,
  deleteWeekListTasksById
};
