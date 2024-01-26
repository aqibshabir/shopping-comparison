const selectFavouritesAll = () => {
  return "SELECT * FROM favourites";
};

const selectFavouritesUpdate = () => {
  return `UPDATE favourites 
  SET mealTitle=? 
  recipeImage=?
  summary=? 
  ingredients=? 
  description=?
  WHERE id=?;`;
};

const selectFavouritesInsert = (options) => {
  return `INSERT INTO favourites (id, 
    mealTitle, 
    recipeImage, 
    summary, 
    ingredients, 
    instructions, 
    recipe_id, 
    date_created) 
        VALUES (NULL, 
          ?,
          ?,
           ?, 
           ?,
            ?,
            ?, 
            current_timestamp());`;
};

const selectFavouritesDelete = () => {
  return `DELETE FROM favourites
              WHERE id = ?`;
};

module.exports = {
  selectFavouritesAll,
  selectFavouritesDelete,
  selectFavouritesInsert,
  selectFavouritesUpdate,
};
