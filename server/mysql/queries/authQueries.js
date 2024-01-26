const getIdFromToken = () => {
  return `SELECT user_id FROM tokens 
                WHERE token LIKE ?;`;
};

module.exports = { getIdFromToken };
