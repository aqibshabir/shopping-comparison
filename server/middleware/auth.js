const { getIdFromToken } = require("../mysql/queries/authQueries");
const mySQLQuery = require("../mysql/connection");

const checkToken = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    res.send({ status: 0, reason: "No token" });
  }

  try {
    const results = await mySQLQuery(getIdFromToken(), [token]);

    //attach user id from tokens and pass to children
    req.user_id = results[0].user_id;

    if (results.length) {
      next();
      return;
    }

    res.send({ status: 0, reason: "Bad token" });
  } catch (e) {
    //
  }
};

module.exports = { checkToken };
