import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },

  connectionTimeout: 10000,
});

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 BEFORE VERIFY");

    await transporter.verify();

    console.log("✅ SMTP VERIFIED");

    console.log("📧 BEFORE SEND");

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
    console.log("❌ MAIL ERROR ❌");
    console.error(error);

    throw error;
  }
};
