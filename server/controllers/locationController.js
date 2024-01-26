const mySQLQuery = require("../mysql/connection.js");
const { selectLocationById, insertLocation } = require("../mysql/queries/locationQueries.js");

const getLocation = async (req, res) => {
  try {
    const results = await mySQLQuery(selectLocationById(), Number(req.user_id));

    if (results && results.length) {
      return res.send(results[0].data);
    }

    res.json({});
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const setLocation = async (req, res) => {
  // save the shopping list JSON to the lists table
  try {
    // get user ID from the token

    const _data = JSON.stringify(req.body);
    console.log(_data);

    await mySQLQuery(insertLocation(), [Number(req.user_id), _data]);
  } catch (e) {
    res.sendStatus(500);
  }

  res.sendStatus(200);
};

module.exports = { setLocation, getLocation };
