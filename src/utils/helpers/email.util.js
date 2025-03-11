const nodemailer = require("nodemailer");
const envVars = require("../../config/server.config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
  },
});

async function sendPasswordMail(email, password) {
  await transporter.sendMail({
    from: envVars.EMAIL_USER,
    to: email,
    subject: "Your password",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">Welcome to Our Platform!</h2>
      <p>Here are your login details:</p>
      
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Password:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">For security reasons, we recommend changing your password immediately.</p>

      <p style="margin-top: 20px;">If you did not create this account, please ignore this email.</p>

      <p style="color: #555;">Best regards, <br> The Support Team</p>
    </div>
  `,
  });
}

async function sendResetPasswordMail(email, resetUrl) {
  await transporter.sendMail({
    from: `"Support Team" <${envVars.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <p>Best regards,</p>
        <p><strong>Your Company Name</strong></p>
      </div>
    `,
  });
}

module.exports = { sendPasswordMail, sendResetPasswordMail };
