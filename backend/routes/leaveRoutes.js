const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getLeaves,
  getLeave,
  updateLeave,
  deleteLeave,
} = require("../controllers/leaveController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Apply for Leave
router.post(
  "/",
  protect,
  authorize(
    "Director",
    "HR Manager",
    "Department Manager",
    "Employee"
  ),
  applyLeave
);

// Get All Leave Requests
router.get(
  "/",
  protect,
  authorize(
    "Director",
    "HR Manager",
    "Department Manager",
    "Employee"
  ),
  getLeaves
);

// Get One Leave Request
router.get(
  "/:id",
  protect,
  authorize(
    "Director",
    "HR Manager",
    "Department Manager",
    "Employee"
  ),
  getLeave
);

// Update Leave
router.put(
  "/:id",
  protect,
  authorize(
    "Director",
    "HR Manager",
    "Department Manager"
  ),
  updateLeave
);

// Delete Leave
router.delete(
  "/:id",
  protect,
  authorize("Director"),
  deleteLeave
);

module.exports = router;