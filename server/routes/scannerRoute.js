const express = require("express");
const router = express.Router();
const { getProductNameBySku } = require("../controllers/scannerController.js");

router.get("/:sku", getProductNameBySku);

module.exports = router;
