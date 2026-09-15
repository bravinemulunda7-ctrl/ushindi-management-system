const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: [
      "Director",
      "Department Manager",
      "Payroll Officer",
      "Employee"
    ],
    default: "Employee",
  },

  department: {
    type: String,
    default: "General",
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  phone: {
    type: String,
    default: "",
  },

  lastLogin: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("User", userSchema);