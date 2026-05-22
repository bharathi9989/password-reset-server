import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 VERIFY START");

    await transporter.verify();

    console.log("✅ SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: toEmail,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset password:</p>
        <a href="${link}">${link}</a>
      `,
    });

    console.log("✅ MAIL SENT");

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.error(error);

    throw error;
  }
};
