const selectUser = (order) => {
  return `
		SELECT id FROM users
		WHERE email LIKE ?
		AND password LIKE ?;`;
};

const insertToken = () => {
  return `
		INSERT INTO tokens
		(user_id, token)
		VALUES 
		(?, ?)
		`;
};

const insertUser = () => {
  return `
		INSERT INTO users 
		(email, password)
		VALUES
		(?, ?);
	`;
};

const deleteToken = (token) => {
  return `DELETE FROM tokens WHERE token LIKE ?;`;
};

module.exports = { insertToken, selectUser, insertUser, deleteToken };
