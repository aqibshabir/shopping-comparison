const express = require("express");
const router = express.Router();
const { getLocation, setLocation } = require("../controllers/locationController.js");

router.get("/", getLocation);
router.post("/", setLocation);

module.exports = router;
