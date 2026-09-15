const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(

  {

    name: {

      type: String,

      required: true,

      unique: true,

      trim: true,

    },

    manager: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,

    },

    description: {

      type: String,

      default: "",

      trim: true,

    },

    employeesCount: {

      type: Number,

      default: 0,

    },

    status: {

      type: String,

      enum: ["Active", "Inactive"],

      default: "Active",

    },

  },

  {

    timestamps: true,

  }

);

module.exports = mongoose.model("Department", departmentSchema);