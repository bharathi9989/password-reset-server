import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: ENV.MAIL_HOST,
  port: Number(ENV.MAIL_PORT),

  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS,
  },
});

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 MAILTRAP SMTP START");

    const info = await transporter.sendMail({
      from: "test@mailtrap.io",
      to: toEmail,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset password</p>
        <a href="${link}">${link}</a>
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
