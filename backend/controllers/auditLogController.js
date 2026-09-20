const AuditLog = require("../models/AuditLog");

// Create audit log
const createAuditLog = async ({
  user,
  action,
  module,
  description = "",
  ipAddress = "",
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      module,
      description,
      ipAddress,
    });
  } catch (error) {
    console.error("Audit Log Error:", error.message);
  }
};

// Get audit logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAuditLog,
  getAuditLogs,
};