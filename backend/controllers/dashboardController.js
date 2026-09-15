const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

const getDashboard = async (req, res) => {
  try {

    // Employee Dashboard
    if (req.user.role === "Employee") {

      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee record not found.",
        });
      }

      const totalAttendance = await Attendance.countDocuments({
        employee: employee._id,
      });

      const totalLeaves = await Leave.countDocuments({
        employee: employee._id,
      });

      return res.json({
        totalAttendance,
        totalLeaves,
      });
    }

    // Director Dashboard
    const totalEmployees = await Employee.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalLeaves = await Leave.countDocuments();

    res.json({
      totalEmployees,
      totalAttendance,
      totalLeaves,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};