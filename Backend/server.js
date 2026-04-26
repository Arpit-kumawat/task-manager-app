const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const countryRoutes = require("./routes/countryRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("DB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {~
  console.log(`Server running on port ${PORT}`);
});
