import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 MAIL START");

    // VERIFY SMTP
    await transporter.verify();

    console.log("✅ SMTP VERIFIED");

    // SEND MAIL
    const info = await transporter.sendMail({
      from: `"Password Reset App" <${ENV.EMAIL_USER}>`,

      to: toEmail,

      subject: "Password Reset Link",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset</h2>

          <p>Click the button below to reset your password.</p>

          <a 
            href="${link}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:6px;
              margin-top:10px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;">
            Or copy this link:
          </p>

          <p>${link}</p>

          <p>
            This link expires in 15 minutes.
          </p>
        </div>
      `,
    });

    console.log("✅ MAIL SENT");
    console.log(info.response);

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.log(error);

    throw new Error("Email sending failed");
  }
};
