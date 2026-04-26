const express = require("express");
const { signupUser, signinUser } = require("../controllers/authController");         

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Signup route working. Use POST request to create user.");
});

router.post("/signup", signupUser);
router.post("/signin", signinUser);

// router.get("/test", (req, res) => {
//   res.json({ message: "Auth route working" });
// });

module.exports = router;