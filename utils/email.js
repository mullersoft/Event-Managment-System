const nodemailer = require("nodemailer");

/**
 * Sends an email using nodemailer.
 * @param {Object} options - Email options.
 * @param {string} options.email - Recipient's email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.message - Message body of the email.
 */
const sendEmail = async (options) => {
  // Create a transporter object using Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: "Event Management System (EMS) <mulerselinger@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: '' // we can add HTML content here if needed
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
