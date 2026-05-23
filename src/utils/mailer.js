import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,

  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000,
});

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 MAIL START");

    console.log("BEFORE VERIFY");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    console.log("BEFORE SEND");

    const info = await transporter.sendMail({
      from: `"Password Reset App" <${ENV.EMAIL_USER}>`,

      to: toEmail,

      subject: "Password Reset Link",

      html: `
        <h2>Password Reset</h2>

        <p>Click below link to reset password</p>

        <a href="${link}">
          Reset Password
        </a>

        <br /><br />

        <p>${link}</p>
      `,
    });

    console.log("AFTER SEND");

    console.log("✅ MAIL SENT");

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");

    console.log(error);

    throw error;
  }
};
