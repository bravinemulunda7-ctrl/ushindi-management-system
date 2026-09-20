const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
} = require("../controllers/auditLogController");

const protect = require("../middleware/authMiddleware");

// Only Director can access audit logs
router.get("/", protect, (req, res, next) => {
  if (req.user.role !== "Director") {
    return res.status(403).json({
      message: "Access denied. Director only.",
    });
  }

  next();
}, getAuditLogs);

module.exports = router;