const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true,
      unique: true,
    },

    startHour: {
      type: Number,
      required: true,
    },

    startMinute: {
      type: Number,
      default: 0,
    },

    graceMinutes: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shift", shiftSchema);