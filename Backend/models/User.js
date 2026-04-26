
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      default: "",
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    zip: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("User", userSchema);