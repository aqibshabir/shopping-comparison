const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Well done, here are all the private stuff!");
});

module.exports = router;
