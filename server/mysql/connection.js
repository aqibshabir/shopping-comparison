const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect();

const mySQLQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    //sets up a promise - sql connection - then returns data from the database
    connection.query(query, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
      // connection.end();
    });
  });
};

module.exports = mySQLQuery;
