const express = require("express");
const {
  deleteUser,
  getAllUserData,
  loginUser,
  registerUser,
  updateUser,
} = require("../service/userService");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);
router.get("/users", getAllUserData);

module.exports = router;
