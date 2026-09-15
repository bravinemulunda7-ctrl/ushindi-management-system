const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  getPayroll,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Create Payroll
router.post(
  "/",
  protect,
  authorize(
    "Director",
    "Payroll Officer"
  ),
  createPayroll
);

// Get All Payroll Records
router.get(
  "/",
  protect,
  authorize(
    "Director",
    "Payroll Officer",
    "HR Manager",
    "Employee"
  ),
  getPayrolls
);

// Get One Payroll Record
router.get(
  "/:id",
  protect,
  authorize(
    "Director",
    "Payroll Officer",
    "HR Manager",
    "Employee"
  ),
  getPayroll
);

// Update Payroll
router.put(
  "/:id",
  protect,
  authorize(
    "Director",
    "Payroll Officer"
  ),
  updatePayroll
);

// Delete Payroll
router.delete(
  "/:id",
  protect,
  authorize("Director"),
  deletePayroll
);

module.exports = router;