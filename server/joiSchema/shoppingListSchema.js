const Joi = require("joi");

const shoppingListSchema = Joi.object({
  currentlist: Joi.number().integer(),
  timeLastChanged: Joi.date().timestamp(),
  lists: Joi.array().items(
    Joi.object({
      id: Joi.number().integer(),
      name: Joi.string(),
      lastactive: Joi.number().integer(),
      items: Joi.array().items(
        Joi.object({
          productId: Joi.number().integer(),
          searchTerm: Joi.string(),
          quantity: Joi.number().integer(),
          ticked: Joi.boolean(),
        })
      ),
    })
  ),
});

module.exports = shoppingListSchema;
