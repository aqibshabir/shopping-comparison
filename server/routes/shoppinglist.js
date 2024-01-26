const express = require("express");
const router = express.Router();
const {
	addShoppingList,
	getShoppingList,
} = require("../controllers/shoppingListController");

router.get("/", getShoppingList);
router.post("/", addShoppingList);

module.exports = router;
