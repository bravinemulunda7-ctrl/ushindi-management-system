const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    totalHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Present",
        "Late",
        "Absent",
        "Half Day",
        "Leave",
      ],
      default: "Present",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    gpsVerified: {
      type: Boolean,
      default: false,
    },

    distanceFromOffice: {
      type: Number,
      default: 0,
      min: 0,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same employee on the same day
attendanceSchema.index(
  { employee: 1, createdAt: 1 },
  { unique: false }
);

module.exports = mongoose.model("Attendance", attendanceSchema);