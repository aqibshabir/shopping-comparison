const mySQLQuery = require("../mysql/connection.js");
const sha256 = require("sha256");
const {
  insertToken,
  selectUser,
  insertUser,
  deleteToken,
} = require("../mysql/queries/userQueries.js");
// const sendEmail = require("../email/sib.js");
const sendEmail = require("../email/nm.js");

const { newUser } = require("../config/emailTemplates.js");

const loginUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    res.send({ status: 0, reason: "Missing data" });
    return;
  }

  password = sha256(password + process.env.PASSWORD_SALT);

  try {
    const results = await mySQLQuery(selectUser(), [email, password]);
    console.log("Running");
    console.log(results);

    if (results.length) {
      const token =
        Math.round(Math.random() * 1000000000000000) + "" + Date.now();

      await mySQLQuery(insertToken(), [results[0].id, token]);

      res.send({ status: 1, token });
      return;
    }

    res.send({ status: 0, reason: "User or password are wrong" });
  } catch (e) {
    //
  }
};

const addNewUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    res.send({ status: 0, reason: "Missing data" });
    return;
  }

  password = sha256(password + process.env.PASSWORD_SALT);

  try {
    const results = await mySQLQuery(insertUser(), [email, password]);

    if (results.affectedRows === 1) {
      res.send({ status: 1 });

      //send email
      sendEmail(email, newUser.subject, newUser.content);
    }
  } catch (e) {
    res.send({ status: 0, reason: e.code });
  }
};

const deleteUser = (req, res) => {
  mySQLQuery(deleteToken(), [req.headers.token]);

  res.send({ status: 1 });
};

module.exports = { loginUser, addNewUser, deleteUser };
