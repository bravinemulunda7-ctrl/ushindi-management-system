const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");

// Get Reports
const getReports = async (req, res) => {
  try {
    // Director
    if (req.user.role === "Director") {
      const employees = await Employee.countDocuments();
      const attendance = await Attendance.countDocuments();
      const leaves = await Leave.countDocuments();
      const payroll = await Payroll.countDocuments();

      return res.json({
        employees,
        attendance,
        leaves,
        payroll,
      });
    }

    // Department Manager
    if (req.user.role === "Department Manager") {
      const employees = await Employee.find({
        department: req.user.department,
      });

      const employeeIds = employees.map(emp => emp._id);

      const attendance = await Attendance.countDocuments({
        employee: { $in: employeeIds },
      });

      const leaves = await Leave.countDocuments({
        employee: { $in: employeeIds },
      });

      return res.json({
        employees: employees.length,
        attendance,
        leaves,
      });
    }

    // Payroll Officer
    if (req.user.role === "Payroll Officer") {
      const payroll = await Payroll.find().populate("employee");

      return res.json(payroll);
    }

    return res.status(403).json({
      message: "Access denied.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getReports,
};