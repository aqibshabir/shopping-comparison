const selectShoppingListById = (user_id) => `SELECT * FROM shoppinglist WHERE user_id=?;`;

const insertShoppingList = () => `
		INSERT INTO
		shoppinglist (user_id, data)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE data=VALUES(data);`;

module.exports = { selectShoppingListById, insertShoppingList };
