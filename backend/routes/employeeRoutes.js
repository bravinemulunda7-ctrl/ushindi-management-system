const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getMyProfile,
  updateMyProfile,
  getEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ==========================
// Create Employee
// Director and Department Manager
// ==========================
router.post(
  "/",
  protect,
  authorize("Director", "Department Manager"),
  createEmployee
);

// ==========================
// Get Employees
// Director -> All Employees
// Department Manager -> Own Department
// Payroll Officer -> All Employees
// Employee -> Own Employee Record
// ==========================
router.get(
  "/",
  protect,
  authorize(
    "Director",
    "Department Manager",
    "Payroll Officer",
    "Employee"
  ),
  getEmployees
);

// ==========================
// Logged-in Employee Profile
// ==========================
router.get(
  "/profile",
  protect,
  authorize(
    "Director",
    "Department Manager",
    "Payroll Officer",
    "Employee"
  ),
  getMyProfile
);

// ==========================
// Update Logged-in Profile
// ==========================
router.put(
  "/profile",
  protect,
  authorize(
    "Director",
    "Department Manager",
    "Payroll Officer",
    "Employee"
  ),
  updateMyProfile
);

// ==========================
// Get One Employee
// ==========================
router.get(
  "/:id",
  protect,
  authorize(
    "Director",
    "Department Manager",
    "Payroll Officer",
    "Employee"
  ),
  getEmployee
);

// ==========================
// Update Employee
// ==========================
router.put(
  "/:id",
  protect,
  authorize("Director", "Department Manager"),
  updateEmployee
);

// ==========================
// Activate / Deactivate Employee
// ==========================
router.patch(
  "/:id/status",
  protect,
  authorize("Director", "Department Manager"),
  toggleEmployeeStatus
);

// ==========================
// Delete Employee
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("Director"),
  deleteEmployee
);

module.exports = router;