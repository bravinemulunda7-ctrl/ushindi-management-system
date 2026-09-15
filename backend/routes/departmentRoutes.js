const express = require("express");

const router = express.Router();

const {

  getDepartments,

  getManagers,

  createDepartment,

  updateDepartment,

  toggleDepartmentStatus,

  deleteDepartment,

} = require("../controllers/departmentController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

// =============================

// Get Active Department Managers

// =============================

router.get(

  "/managers",

  protect,

  authorize("Director"),

  getManagers

);

// =============================

// Get All Departments

// =============================

router.get(

  "/",

  protect,

  authorize("Director"),

  getDepartments

);

// =============================

// Create Department

// =============================

router.post(

  "/",

  protect,

  authorize("Director"),

  createDepartment

);

// =============================

// Update Department

// =============================

router.put(

  "/:id",

  protect,

  authorize("Director"),

  updateDepartment

);

// =============================

// Activate / Deactivate Department

// =============================

router.patch(

  "/:id/status",

  protect,

  authorize("Director"),

  toggleDepartmentStatus

);

// =============================

// Delete Department

// =============================

router.delete(

  "/:id",

  protect,

  authorize("Director"),

  deleteDepartment

);

module.exports = router;