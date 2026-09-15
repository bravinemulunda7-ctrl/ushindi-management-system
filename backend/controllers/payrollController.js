const Payroll = require("../models/Payroll");

const Employee = require("../models/Employee");

// Create Payroll

const createPayroll = async (req, res) => {

  try {

    const payroll = await Payroll.create(req.body);

    res.status(201).json({

      message: "Payroll created successfully",

      payroll,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get Payroll Records

const getPayrolls = async (req, res) => {

  try {

    let payrolls;

    if (req.user.role === "Employee") {

      const employee = await Employee.findOne({

        user: req.user._id,

      });

      if (!employee) {

        return res.status(404).json({

          message: "Employee record not found",

        });

      }

      payrolls = await Payroll.find({

        employee: employee._id,

      })

        .populate("employee")

        .sort({ createdAt: -1 });

    } else if (

      req.user.role === "Director" ||

      req.user.role === "Payroll Officer"

    ) {

      payrolls = await Payroll.find()

        .populate("employee")

        .sort({ createdAt: -1 });

    } else {

      return res.status(403).json({

        message: "Access denied.",

      });

    }

    res.status(200).json(payrolls);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get Single Payroll

const getPayroll = async (req, res) => {

  try {

    const payroll = await Payroll.findById(req.params.id)

      .populate("employee");

    if (!payroll) {

      return res.status(404).json({

        message: "Payroll record not found",

      });

    }

    // Employee can only view their own payroll

    if (req.user.role === "Employee") {

      const employee = await Employee.findOne({

        user: req.user._id,

      });

      if (

        !employee ||

        payroll.employee._id.toString() !== employee._id.toString()

      ) {

        return res.status(403).json({

          message: "Access denied.",

        });

      }

    }

    res.status(200).json(payroll);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Update Payroll

const updatePayroll = async (req, res) => {

  try {

    const payroll = await Payroll.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

        new: true,

        runValidators: true,

      }

    );

    if (!payroll) {

      return res.status(404).json({

        message: "Payroll record not found",

      });

    }

    res.status(200).json({

      message: "Payroll updated successfully",

      payroll,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Delete Payroll

const deletePayroll = async (req, res) => {

  try {

    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {

      return res.status(404).json({

        message: "Payroll record not found",

      });

    }

    res.status(200).json({

      message: "Payroll deleted successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  createPayroll,

  getPayrolls,

  getPayroll,

  updatePayroll,

  deletePayroll,

};