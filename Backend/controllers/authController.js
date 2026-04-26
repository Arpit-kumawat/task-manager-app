const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
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
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      address,
      country,
      state,
      city,
      zip: Number(zip),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "arpit_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        country: user.country,
        state: user.state,
        city: user.city,
        zip: user.zip,
      },
    });
  } catch (error) {
    console.log("Signin Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signupUser,
  signinUser,
};