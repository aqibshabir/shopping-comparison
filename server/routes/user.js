const express = require("express");
const router = express.Router();

const {
	loginUser,
	addNewUser,
	deleteUser,
} = require("../controllers/userController.js");

router.post("/login", loginUser);
router.post("/signup", addNewUser);
router.delete("/", deleteUser);

module.exports = router;
