const express = require("express");

const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

// Mark attendance (Check In)
router.post("/", protect, markAttendance);

// Get all attendance records
router.get("/", protect, getAttendance);

// Get one attendance record
router.get("/:id", protect, getAttendanceById);

// Check Out / Update attendance
router.put("/:id", protect, updateAttendance);

// Delete attendance
router.delete("/:id", protect, deleteAttendance);

module.exports = router;