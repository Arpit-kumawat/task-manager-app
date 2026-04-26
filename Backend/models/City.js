
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    zip: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", citySchema);