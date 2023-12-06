const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const weekListSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    timeCreated: {
      type: Date,
      default: Date.now,
    },
    weekTask: [
      {
        tasks: [
          {
            taskName: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
            isMarked: {
              type: Boolean,
              required: true,
            },
          },
        ],
      },
    ],
    isCompleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WeekList", weekListSchema);
