const nodemailer = require("nodemailer");
const { emailSender, hpServer } = require("../config/email");

const transporter = nodemailer.createTransport({
  host: hpServer,
  port: 587,
  secure: false,
  tls: { rejectUnauthorized: false }, //supress errors
  auth: { user: emailSender, pass: process.env.HP_EMAIL_PASSWORD },
});

const sendEmail = (email, subject, text) => {
  transporter.sendMail(
    { from: emailSender, subject, text, to: email },
    (err, data) => {
      console.log(err, data);
    }
  );
};

module.exports = sendEmail;
