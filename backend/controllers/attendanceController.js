const Attendance = require("../models/Attendance");

const Employee = require("../models/Employee");
const Shift = require("../models/Shift");

// Office GPS Coordinates (Replace with your office coordinates)

const OFFICE_LATITUDE = -3.3966;

const OFFICE_LONGITUDE = 38.5561;

const ALLOWED_RADIUS = 200; // meters

// Calculate distance between two GPS coordinates

function calculateDistance(lat1, lon1, lat2, lon2) {

  const R = 6371000; // Earth radius in meters

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =

    Math.sin(dLat / 2) * Math.sin(dLat / 2) +

    Math.cos((lat1 * Math.PI) / 180) *

      Math.cos((lat2 * Math.PI) / 180) *

      Math.sin(dLon / 2) *

      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;

}

// Check In

const markAttendance = async (req, res) => {

  try {

    const {

      employee,

      checkIn,

      latitude,

      longitude,

      remarks,

    } = req.body;

    const employeeData = await Employee.findById(employee);

    if (!employeeData) {

      return res.status(404).json({

        message: "Employee not found.",

      });

    }

    // Prevent duplicate attendance for today

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({

      employee,

      createdAt: { $gte: today },

    });

    if (existingAttendance) {

      return res.status(400).json({

        message: "Attendance already marked today.",

      });

    }

    // GPS verification

    const distance = calculateDistance(

      latitude,

      longitude,

      OFFICE_LATITUDE,

      OFFICE_LONGITUDE

    );

    const gpsVerified = distance <= ALLOWED_RADIUS;
// ===========================================

// Automatic attendance status based on shift

// ===========================================

// Get shift settings from database
const shift = await Shift.findOne({
  name: employeeData.shift || "Morning",
});

if (!shift) {
  return res.status(400).json({
    message: "Employee shift not found.",
  });
}

const checkInTime = new Date(checkIn);

// Expected reporting time
const reportTime = new Date(checkIn);

reportTime.setHours(
  shift.startHour,
  shift.startMinute,
  0,
  0
);

// Apply grace period
reportTime.setMinutes(
  reportTime.getMinutes() + shift.graceMinutes
);

// Determine attendance status
const status =
  checkInTime > reportTime ? "Late" : "Present";


    const attendance = await Attendance.create({

      employee,

      department: employeeData.department,

      checkIn,

      latitude,

      longitude,

      gpsVerified,

      distanceFromOffice: Math.round(distance),

      status,

      remarks,

    });

    const populatedAttendance = await Attendance.findById(attendance._id)

      .populate("employee", "fullName employeeId department");

    res.status(201).json({

      message: "Attendance marked successfully.",

      attendance: populatedAttendance,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Check Out

const updateAttendance = async (req, res) => {

  try {

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {

      return res.status(404).json({

        message: "Attendance not found.",

      });

    }

    attendance.checkOut = req.body.checkOut || new Date();

    const hours =

      (new Date(attendance.checkOut) -

        new Date(attendance.checkIn)) /

      (1000 * 60 * 60);

    attendance.totalHours = Number(hours.toFixed(2));

    if (req.body.remarks) {

      attendance.remarks = req.body.remarks;

    }

    await attendance.save();

    const updatedAttendance = await Attendance.findById(attendance._id)

      .populate("employee", "fullName employeeId department");

    res.status(200).json({

      message: "Attendance updated successfully.",

      attendance: updatedAttendance,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get Attendance
const getAttendance = async (req, res) => {
  try {

    let attendance;

    // ==========================
    // Director sees everything
    // ==========================
    if (req.user.role === "Director") {

      attendance = await Attendance.find()
        .populate("employee", "fullName employeeId department")
        .sort({ createdAt: -1 });

    }

    // ==========================
    // Department Manager
    // Only sees employees in own department
    // ==========================
    else if (req.user.role === "Department Manager") {

      attendance = await Attendance.find()
        .populate({
          path: "employee",
          select: "fullName employeeId department",
          match: {
            department: req.user.department,
          },
        })
        .sort({ createdAt: -1 });

      // Remove attendance records whose employee
      // belongs to another department
      attendance = attendance.filter(
        (record) => record.employee !== null
      );

    }

    // ==========================
    // Employee
    // ==========================
    else if (req.user.role === "Employee") {

      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee record not found.",
        });
      }

      attendance = await Attendance.find({
        employee: employee._id,
      })
        .populate("employee", "fullName employeeId department")
        .sort({ createdAt: -1 });

    }

    // ==========================
    // Payroll Officer
    // No Attendance Access
    // ==========================
    else {

      return res.status(403).json({
        message: "Access denied.",
      });

    }

    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// Get Single Attendance

const getAttendanceById = async (req, res) => {

  try {

    const attendance = await Attendance.findById(req.params.id)

      .populate("employee", "fullName employeeId department");

    if (!attendance) {

      return res.status(404).json({

        message: "Attendance not found.",

      });

    }

    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Delete Attendance

const deleteAttendance = async (req, res) => {

  try {

    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {

      return res.status(404).json({

        message: "Attendance not found.",

      });

    }

    res.status(200).json({

      message: "Attendance deleted successfully.",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  markAttendance,

  getAttendance,

  getAttendanceById,

  updateAttendance,

  deleteAttendance,

};