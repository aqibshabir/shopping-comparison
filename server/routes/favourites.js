const express = require("express");
const router = express.Router();

const {
  addFavourites,
  getAllFavourites,
  updateFavourites,
  deleteFavourites,
} = require("../controllers/favouritesController");

//favourites route
router.post("/", addFavourites); // updates
router.get("/", getAllFavourites); // reads
router.put("/", updateFavourites); //creates
router.delete("/", deleteFavourites); // deletes

module.exports = router;
