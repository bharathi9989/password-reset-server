import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📨 START MAIL FUNCTION");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
    });

    console.log("✅ TRANSPORT CREATED");

    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below:</p>
        <a href="${link}">${link}</a>
      `,
    });

    console.log("✅ MAIL SENT");
    console.log(info);
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.log(error);
  }
};
