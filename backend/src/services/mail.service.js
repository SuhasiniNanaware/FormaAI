const transporter = require("../config/mail");

const sendVerificationEmail = async (email, username, link) => {
  const fromAddress = process.env.EMAIL_USER || "no-reply@forma-ai.local";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`Verification email for ${email} (${username}): ${link}`);
  }

  await transporter.sendMail({
    from: `"Forma AI" <${fromAddress}>`,
    to: email,
    subject: "Verify Your Forma AI Account",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Hello ${username} 👋</h2>
        <p>Welcome to Forma AI.</p>
        <p>Please verify your email.</p>
        <a href="${link}" style="padding:12px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};