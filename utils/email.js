const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `EMS <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid configuration
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(subject, message) {
    //1) Render HTML based on template
    // const html = res.send({
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`, // Convert message to HTML
      // html,
      // text: htmlToText.fromString(html),
    };
    //3) create a transport and send the email
    // this.newTransport();
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    const message = `Hi ${this.firstName},\nWelcome to the Event Management System! Click the following link to get started: ${this.url}`;
    await this.send("Welcome to Event Management System", message);
  }
  async sendPasswordReset() {
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.\nIf you did not forget your password, please ignore this email.`;
    await this.send(
      "Your password reset token (valid for only 10 minutes)",
      message
    );
  }
};
// const sendEmail = async (options) => {
// Create a transporter object using Gmail service
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// Email options
// const mailOptions = {
//   from: "Event Management System (EMS) <mulerselinger@gmail.com>",
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html: '' // we can add HTML content here if needed
// };

// Send the email
// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail
