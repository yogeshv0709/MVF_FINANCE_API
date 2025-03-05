const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPasswordMail(email, password) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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

module.exports = sendPasswordMail;
