const Department = require("../models/Department");
const Employee = require("../models/Employee");
const User = require("../models/User");

// Get All Departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("manager", "fullName email role");

    const departmentData = await Promise.all(
      departments.map(async (department) => {
        const totalEmployees = await Employee.countDocuments({
          department: department.name,
        });

        return {
          ...department.toObject(),
          totalEmployees,
        };
      })
    );

    res.status(200).json(departmentData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Department Managers
const getManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: "Department Manager",
      status: "Active",
    }).select("_id fullName email department");

    res.status(200).json(managers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Department
const createDepartment = async (req, res) => {
  try {
    const { name, manager, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required.",
      });
    }

    const exists = await Department.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Department already exists.",
      });
    }

    if (manager) {
      const managerUser = await User.findById(manager);

      if (!managerUser) {
        return res.status(404).json({
          message: "Selected manager not found.",
        });
      }
    }

    const department = await Department.create({
      name,
      manager: manager || null,
      description,
      status: "Active",
    });

    const populatedDepartment = await Department.findById(department._id)
      .populate("manager", "fullName email role");

    res.status(201).json({
      message: "Department created successfully.",
      department: populatedDepartment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const { name, manager, description, status } = req.body;

    if (manager) {
      const managerUser = await User.findById(manager);

      if (!managerUser) {
        return res.status(404).json({
          message: "Selected manager not found.",
        });
      }
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name,
        manager: manager || null,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("manager", "fullName email role");

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.status(200).json({
      message: "Department updated successfully.",
      department,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate / Deactivate Department
const toggleDepartmentStatus = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    department.status =
      department.status === "Active"
        ? "Inactive"
        : "Active";

    await department.save();

    res.status(200).json({
      message: "Department status updated successfully.",
      department,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.status(200).json({
      message: "Department deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartments,
  getManagers,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
};