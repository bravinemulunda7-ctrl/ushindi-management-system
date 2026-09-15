const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ===============================

// Upload Report

// Director & Payroll Officer only

// ===============================

router.post(

  "/upload",

  protect,

  authorize("Director", "Payroll Officer"),

  (req, res) => {

    res.status(201).json({

      message: "Report uploaded successfully.",

    });

  }

);

// ===============================

// View Reports

// ===============================

router.get(

  "/",

  protect,

  authorize(

    "Director",

    "Department Manager",

    "Payroll Officer"

  ),

  (req, res) => {

    if (req.user.role === "Director") {

      return res.json({

        message: "Director can view all reports.",

      });

    }

    if (req.user.role === "Department Manager") {

      return res.json({

        message: `Reports for ${req.user.department} department.`,

      });

    }

    if (req.user.role === "Payroll Officer") {

      return res.json({

        message: "Payroll reports only.",

      });

    }

    res.status(403).json({

      message: "Access denied.",

    });

  }

);

module.exports = router;