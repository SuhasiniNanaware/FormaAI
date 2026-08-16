const nodemailer = require("nodemailer");

const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });

if (!hasEmailCredentials) {
  console.warn("EMAIL_USER and EMAIL_PASS are not configured. Verification emails will be logged to the backend console instead of being sent.");
}

module.exports = transporter;