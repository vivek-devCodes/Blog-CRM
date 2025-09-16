const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (to, resetLink) => {
  const fs = require('fs');
  const path = require('path');
  const templatePath = path.join(__dirname, '../email-template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replace('{{reset_link}}', resetLink);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset',
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
