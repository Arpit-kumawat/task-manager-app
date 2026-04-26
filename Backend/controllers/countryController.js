const Country = require("../models/Country");

const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch countries", error: error.message });
  }
};

const addCountry = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Country name is required" });
    }

    const existingCountry = await Country.findOne({ name: name.trim() });
    if (existingCountry) {
      return res.status(400).json({ message: "Country already exists" });
    }

    const country = await Country.create({ name: name.trim() });
    res.status(201).json(country);
  } catch (error) {
    res.status(500).json({ message: "Failed to add country", error: error.message });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Country name is required" });
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update country", error: error.message });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete country", error: error.message });
  }
};

module.exports = {
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry,
};