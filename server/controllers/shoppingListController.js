const mySQLQuery = require("../mysql/connection.js");
const Joi = require("joi");
const shoppingListSchema = require("../joiSchema/shoppingListSchema.js");

const {
  selectShoppingListById,
  insertShoppingList,
} = require("../mysql/queries/shoppingListQueries.js");

const getShoppingList = async (req, res) => {
  try {
    const results = await mySQLQuery(selectShoppingListById(), [Number(req.user_id)]);

    if (results && results.length) {
      return res.send(results[0].data);
    }

    res.json({});
  } catch (e) {
    res.sendStatus(500);
  }
};

const addShoppingList = async (req, res) => {
  // save the shopping list JSON to the lists table
  try {
    // Validate with Joi
    await shoppingListSchema.validateAsync(req.body);

    const _data = JSON.stringify(req.body);
    await mySQLQuery(insertShoppingList(), [Number(req.user_id), _data]);
  } catch (e) {
    res.sendStatus(500);
  }
  res.sendStatus(200);
};

module.exports = { addShoppingList, getShoppingList };
