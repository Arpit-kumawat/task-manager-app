const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const { country, state } = req.query;

    let filter = {};
    if (country) filter.country = country;
    if (state) filter.state = state;

    const cities = await City.find(filter)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "city zip")
      .sort({ createdAt: -1 });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cities",
      error: error.message,
    });
  }
};

exports.createCity = async (req, res) => {
  try {
    const { city, country, state, zip } = req.body;

    if (!city?.trim() || !country || !state) {
      return res.status(400).json({
        message: "City, country and state are required",
      });
    }

    const newCity = await City.create({
      city: city.trim(),
      country,
      state,
      zip: zip || "",
    });

    const populatedCity = await City.findById(newCity._id)
      .populate("country", "name")
      .populate("state", "name");

    res.status(201).json({
      message: "City created successfully",
      city: populatedCity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create city",
      error: error.message,
    });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, country, state, zip } = req.body;

    if (!city?.trim() || !country || !state) {
      return res.status(400).json({
        message: "City, country and state are required",
      });
    }

    const updatedCity = await City.findByIdAndUpdate(
      id,
      {
        city: city.trim(),
        country,
        state,
        zip: zip || "",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("country", "name")
      .populate("state", "name");

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update city",
      error: error.message,
    });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByIdAndDelete(id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete city",
      error: error.message,
    });
  }
};