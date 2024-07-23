const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host: 'sandbox.smtp.mailtrap.io',
    // port: 2525,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "Event Managment System(EMS) <mulerselinger@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:''
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
