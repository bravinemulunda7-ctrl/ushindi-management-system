const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
} = require("../controllers/auditLogController");

const protect = require("../middleware/authMiddleware");

// Only authenticated users can access audit logs
router.get("/", protect, getAuditLogs);

module.exports = router;