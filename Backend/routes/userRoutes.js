const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();
const fileUpload = require("../middleware/fileUpload");

router.get("/all-users", getAllUsers);
router.get("/:id", getSingleUser);
router.post("/add-user", fileUpload.single("file"), addUser);
router.put("/update-user/:id", fileUpload.single("file"), updateUser);
router.delete("/delete-user/:id", deleteUser);
// router.post("/add", upload.single("file"), addUser);
 
module.exports = router;




