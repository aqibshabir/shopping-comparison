const express = require("express");
const router = express.Router();
const {
  fetchProducts,
  reconstructData,
} = require("../controllers/productsController");

// Route to fetch products
router.get("/", fetchProducts);

module.exports = router;
