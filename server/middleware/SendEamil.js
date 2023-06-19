const nodeMailer = require("nodemailer");

const SendMail = (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMPT_USER_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.SMPT_USER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOption);
};

module.exports = SendMail;
