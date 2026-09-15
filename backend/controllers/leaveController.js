const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Leave Requests
const getLeaves = async (req, res) => {
  try {
    let leaves;

    // Employee sees only their own leave requests
    if (req.user.role === "Employee") {

      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee record not found",
        });
      }

      leaves = await Leave.find({
        employee: employee._id,
      })
        .populate("employee")
        .sort({ createdAt: -1 });

    }

    // Department Manager sees only their department
    else if (req.user.role === "Department Manager") {

      const employees = await Employee.find({
        department: req.user.department,
      });

      const employeeIds = employees.map(emp => emp._id);

      leaves = await Leave.find({
        employee: { $in: employeeIds },
      })
        .populate("employee")
        .sort({ createdAt: -1 });

    }

    // Director and HR Manager see all
    else {

      leaves = await Leave.find()
        .populate("employee")
        .sort({ createdAt: -1 });

    }

    res.status(200).json(leaves);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get One Leave Request
const getLeave = async (req, res) => {
  try {

    const leave = await Leave.findById(req.params.id)
      .populate("employee");

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    // Employee can only view their own leave
    if (req.user.role === "Employee") {

      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (!employee || leave.employee._id.toString() !== employee._id.toString()) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    res.status(200).json(leave);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Leave
const updateLeave = async (req, res) => {
  try {

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      message: "Leave updated successfully",
      leave,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Leave
const deleteLeave = async (req, res) => {
  try {

    const leave = await Leave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      message: "Leave deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  getLeave,
  updateLeave,
  deleteLeave,
};