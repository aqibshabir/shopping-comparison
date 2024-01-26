//boiler plate
const { emailSender, nameSender } = require("../config/email");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_KEY;

const sendEmail = (email, subject, content) => {
  if (!email || !subject || !content) {
    throw new Error("Missing data!");
  }

  //out bit
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = content;
  sendSmtpEmail.sender = { email: emailSender, name: nameSender };
  sendSmtpEmail.to = [{ email }];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(data);
    },
    function (error) {
      console.log(error);
    }
  );
};

module.exports = sendEmail;
