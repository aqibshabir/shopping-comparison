const selectLocationById = () => `SELECT * FROM location WHERE user_id=?;`;

const insertLocation = () => `INSERT INTO
			location (user_id, data)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE data=VALUES(data);`;

module.exports = { selectLocationById, insertLocation };
