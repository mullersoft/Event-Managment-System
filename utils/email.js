const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host: 'sandbox.smtp.mailtrap.io',
    // port: 2525,
    service: 'gmail',
    auth: {
      user: 'mulerselinger@gmail.com',
      pass: 'famq tbxh fvzf tucb ',
    },
  });
  const mailOptions = {
    from: 'Mulugeta Linger <mulerselinger@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:''
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
