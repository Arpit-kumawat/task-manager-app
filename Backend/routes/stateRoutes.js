const express = require("express");
const router = express.Router();
const {
  getStates,
  createState,
  updateState,
  deleteState,
} = require("../controllers/stateController");

router.get("/", getStates);
router.post("/", createState);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

module.exports = router;