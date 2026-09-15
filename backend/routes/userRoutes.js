const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getManagers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =============================
// Get Department Managers
// =============================
router.get(
  "/managers",
  protect,
  authorize("Director", "Department Manager"),
  getManagers
);

// =============================
// Get All Users
// =============================
router.get(
  "/",
  protect,
  authorize("Director"),
  getUsers
);

// =============================
// Create User
// =============================
router.post(
  "/",
  protect,
  authorize("Director"),
  createUser
);

// =============================
// Update User
// =============================
router.put(
  "/:id",
  protect,
  authorize("Director"),
  updateUser
);

// =============================
// Activate / Deactivate User
// =============================
router.patch(
  "/:id/status",
  protect,
  authorize("Director"),
  toggleUserStatus
);

// =============================
// Delete User
// =============================
router.delete(
  "/:id",
  protect,
  authorize("Director"),
  deleteUser
);

module.exports = router;