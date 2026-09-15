const Employee = require("../models/Employee");

// Create Employee

const createEmployee = async (req, res) => {
  try {
    console.log("Received Employee:", req.body);

    const employee = await Employee.create(req.body);

    res.status(201).json({
      message: "Employee created successfully.",
      employee,
    });

} catch (error) {
  console.error("Employee Create Error:", error);

  if (error.errors) {
    console.log(error.errors);
  }

  res.status(500).json({
    message: error.message,
  });
}
};

// Get Employees

const getEmployees = async (req, res) => {

  try {

    let employees;

    // Director sees all employees

    if (req.user.role === "Director") {

      employees = await Employee.find()

        .populate("manager", "fullName email")

        .sort({ createdAt: -1 });

    }

    // Department Manager sees only employees in their department

    else if (req.user.role === "Department Manager") {

      employees = await Employee.find({

        department: req.user.department,

      })

        .populate("manager", "fullName email")

        .sort({ createdAt: -1 });

    }

// Employees sees only themselves
else if (req.user.role === "Employee") {

    console.log("Logged in email:", req.user.email);

    const employee = await Employee.find({
        email: req.user.email,
    });

    console.log("Employee Results:", employee);

    employees = employee;
}

    // Payroll Officer sees all employees
else if (req.user.role === "Payroll Officer") {

  employees = await Employee.find()
    .populate("manager", "fullName email")
    .sort({ createdAt: -1 });

}

// Any other role
else {

  return res.status(403).json({
    message: "Access denied.",
  });

}

    res.status(200).json(employees);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};
// Get Logged-in Employee Profile
const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    }).populate("manager", "fullName email");

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found.",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ============================
// Update Logged-in Employee Profile
// ============================
const updateMyProfile = async (req, res) => {

  try {

    console.log("========== UPDATE PROFILE ==========");

    console.log("Logged user:", req.user);

    console.log("Body:", req.body);

    const employee = await Employee.findOne({

      user: req.user._id,

    });

    console.log("Employee Found:", employee);

    if (!employee) {

      return res.status(404).json({

        message: "Employee profile not found.",

      });
    }

    employee.phone = req.body.phone || employee.phone;
    employee.address = req.body.address || employee.address;
    employee.nationalId =
      req.body.nationalId || employee.nationalId;
    employee.profilePhoto =
      req.body.profilePhoto || employee.profilePhoto;

    await employee.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Employee

const getEmployee = async (req, res) => {

  try {

    const employee = await Employee.findById(req.params.id)

      .populate("manager", "fullName email");

    if (!employee) {

      return res.status(404).json({

        message: "Employee not found.",

      });

    }
 

    // Employee can only view themselves

    if (

      req.user.role === "Employee" &&

      employee.user.toString() !== req.user._id.toString()

    ) {

      return res.status(403).json({

        message: "Access denied.",

      });

    }

    // Department Manager can only view their department

    if (

      req.user.role === "Department Manager" &&

      employee.department !== req.user.department

    ) {

      return res.status(403).json({

        message: "Access denied.",

      });

    }

    // Payroll Officer cannot view employee records

    if (req.user.role === "Payroll Officer") {

      return res.status(403).json({

        message: "Access denied.",

      });

    }

    res.status(200).json(employee);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Update Employee

const updateEmployee = async (req, res) => {

  try {

    const employee = await Employee.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

        new: true,

        runValidators: true,

      }

    );

    if (!employee) {

      return res.status(404).json({

        message: "Employee not found.",

      });

    }

    res.status(200).json({

      message: "Employee updated successfully.",

      employee,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Activate / Deactivate Employee

const toggleEmployeeStatus = async (req, res) => {

  try {

    const employee = await Employee.findById(req.params.id);

    if (!employee) {

      return res.status(404).json({

        message: "Employee not found.",

      });

    }

    employee.status =

      employee.status === "Active"

        ? "Inactive"

        : "Active";

    await employee.save();

    res.status(200).json({

      message: "Employee status updated successfully.",

      employee,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Delete Employee

const deleteEmployee = async (req, res) => {

  try {

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {

      return res.status(404).json({

        message: "Employee not found.",

      });

    }

    res.status(200).json({

      message: "Employee deleted successfully.",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {
  createEmployee,
  getEmployees,
  getMyProfile,
  updateMyProfile,
  getEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
};