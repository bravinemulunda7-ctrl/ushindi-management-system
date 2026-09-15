const express = require("express");

const router = express.Router();

const {

  register,

  login,

  getUsers,

  getUser,

} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ==========================

// Authentication

// ==========================

router.post("/register", register);

router.post("/login", login);

// ==========================

// User Management

// Only Director can manage users

// ==========================

router.get(

  "/users",

  protect,

  authorize("Director"),

  getUsers

);

router.get(

  "/users/:id",

  protect,

  authorize("Director"),

  getUser

);

module.exports = router;