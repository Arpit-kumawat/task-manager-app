const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      country,
      state,
      city,
      zip,
      password,
      confirmPassword,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !country ||
      !state ||
      !city ||
      !zip ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      file: req.file ? req.file.filename : "",
      firstName,
      lastName,
      email,
      address,
      country,
      state,
      city,
      zip,
      password: hashedPassword,
    });

    const populatedUser = await User.findById(user._id)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "city zip");

    res.status(201).json({
      message: "User added successfully",
      user: populatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add user",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "city zip")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("Get all users error:", error.message);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message, 
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "city zip");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      address,
      country,
      state,
      city,
      zip,
    } = req.body;

    const oldUser = await User.findById(id);
    if (!oldUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedData = {
      firstName,
      lastName,
      email,
      address,
      country,
      state,
      city,
      zip,
    };

    if (req.file) {
      updatedData.file = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "city zip");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};