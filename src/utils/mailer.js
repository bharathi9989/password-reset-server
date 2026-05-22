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

    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: toEmail,
      subject: "Password Reset Link",

      html: `
        <h2>Password Reset</h2>

        <p>Click below link to reset password</p>

        <a href="${link}">
          Reset Password
        </a>

        <p>${link}</p>
      `,
    });

    console.log("✅ MAIL SENT");

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.log(error);

    throw error;
  }
};
