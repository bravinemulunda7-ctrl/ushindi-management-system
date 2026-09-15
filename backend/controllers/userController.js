const User = require("../models/User");

const bcrypt = require("bcryptjs");

// Create User

const createUser = async (req, res) => {

  try {

    const { fullName, email, password, role, department, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        message: "User already exists.",

      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      fullName,

      email,

      password: hashedPassword,

      role,

      department,

      phone,

    });

    res.status(201).json({

      message: "User created successfully.",

      user,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get All Users

const getUsers = async (req, res) => {

  try {

    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get Single User

const getUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({

        message: "User not found.",

      });

    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Update User

const updateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

        new: true,

        runValidators: true,

      }

    );

    if (!user) {

      return res.status(404).json({

        message: "User not found.",

      });

    }

    res.status(200).json({

      message: "User updated successfully.",

      user,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Activate / Deactivate User

const toggleUserStatus = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({

        message: "User not found.",

      });

    }

    user.status =

      user.status === "Active"

        ? "Inactive"

        : "Active";

    await user.save();

    res.status(200).json({

      message: "User status updated successfully.",

      user,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Get Department Managers

const getManagers = async (req, res) => {

  try {

    const managers = await User.find({

      role: "Department Manager",

      status: "Active",

    }).select("_id fullName email");

    res.status(200).json(managers);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// Delete User

const deleteUser = async (req, res) => {

  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {

      return res.status(404).json({

        message: "User not found.",

      });

    }

    res.status(200).json({

      message: "User deleted successfully.",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  createUser,

  getUsers,

  getUser,

  updateUser,

  toggleUserStatus,

  deleteUser,

  getManagers,

};