const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Profile Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email?.toLowerCase(),
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        zip: Number(req.body.zip),
      },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };