const State = require("../models/State");

exports.getStates = async (req, res) => {
  try {
    const { country } = req.query;

    let filter = {};
    if (country) {
      filter.country = country;
    }

    const states = await State.find(filter)
      .populate("country", "name")
      .sort({ name: 1 });

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch states", error: error.message });
  }
};

exports.createState = async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name?.trim() || !country) {
      return res.status(400).json({ message: "State name and country are required" });
    }

    const state = await State.create({
      name: name.trim(),
      country,
    });

    const populatedState = await State.findById(state._id).populate("country", "name");

    res.status(201).json({ message: "State created successfully", state: populatedState });
  } catch (error) {
    res.status(500).json({ message: "Failed to create state", error: error.message });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country } = req.body;

    const state = await State.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        country,
      },
      { new: true }
    ).populate("country", "name");

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State updated successfully", state });
  } catch (error) {
    res.status(500).json({ message: "Failed to update state", error: error.message });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const state = await State.findByIdAndDelete(id);

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete state", error: error.message });
  }
};