const mySQLQuery = require("../mysql/connection");
// const q = require("../mysql/queries/menuQueries");
const {
  selectFavouritesAll,
  selectFavouritesDelete,
  selectFavouritesInsert,
  selectFavouritesUpdate,
} = require("../mysql/queries/menuQueries");

//r
const getAllFavourites = async (req, res) => {
  try {
    const data = await mySQLQuery(selectFavouritesAll());
    res.send(data);
  } catch (error) {
    // res.send(error);
  }
};

const updateFavourites = async (req, res) => {
  const options = {
    id: req.body.id,
    recipeImage: req.body.recipeImage,
    mealTitle: req.body.mealTitle,
    summary: req.body.summary,
    ingredients: req.body.ingredients,
    description: req.body.description,
  };
  try {
    const data = await mySQLQuery(selectFavouritesUpdate(), [
      options.mealTitle,
      options.recipeImage,
      options.summary,
      options.ingredients,
      options.description,
      options.id,
    ]);
    res.send(data);
  } catch (error) {
    // res.send(error);
  }
};

const deleteFavourites = async (req, res) => {
  if (!req.body.id) {
    res.send("no id sent");
  } // defensive check
  const options = {
    id: req.body.id,
  };
  try {
    const data = await mySQLQuery(selectFavouritesDelete(), [options.id]);
    res.send(data);
  } catch (error) {
    // res.send(error);
  }
};

const addFavourites = async (req, res) => {
  const options = {
    recipeImage: req.body.recipeImage,
    mealTitle: req.body.mealTitle,
    summary: req.body.summary.replaceAll(`"`, `\\"`).replaceAll(`'`, `\\'`),
    ingredients: req.body.ingredients
      .replaceAll(`"`, `\\"`)
      .replaceAll(`'`, `\\'`),
    recipe_id: req.body.recipe_id,
    instructions: req.body.instructions
      .replaceAll(`"`, `\\"`)
      .replaceAll(`'`, `\\'`),
  };

  try {
    const data = await mySQLQuery(selectFavouritesInsert(), [
      options.mealTitle,
      options.recipeImage,
      options.summary,
      options.ingredients,
      options.instructions,
      options.recipe_id,
    ]);
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
};

module.exports = {
  addFavourites,
  getAllFavourites,
  updateFavourites,
  deleteFavourites,
};
