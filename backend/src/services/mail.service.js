const transporter = require("../config/mail");

const sendVerificationEmail = async (email, username, link) => {

    await transporter.sendMail({

        from: `"Forma AI" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Verify Your Forma AI Account",

        html: `
        <div style="font-family:Arial;padding:20px">

            <h2>Hello ${username} 👋</h2>

            <p>Welcome to Forma AI.</p>

            <p>Please verify your email.</p>

            <a href="${link}"
               style="padding:12px 20px;
               background:#4f46e5;
               color:white;
               text-decoration:none;
               border-radius:6px;">
               Verify Email
            </a>

        </div>
        `,
    });

};

const sendPasswordResetEmail = async (
  email,
  username,
  resetLink
) => {
  await transporter.sendMail({
    from: `"Forma AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Forma AI password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px;">
        <h2>Reset your Forma AI password</h2>

        <p>Hello ${username || "there"},</p>

        <p>
          We received a request to reset your Forma AI password.
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#6366f1;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link expires in 30 minutes.</p>

        <p>
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = {

    sendVerificationEmail,
    sendPasswordResetEmail,

};