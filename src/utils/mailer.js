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
});

export const sendResetEmail = async (toEmail, link) => {
  console.log("📩 MAIL FUNCTION START");

  const info = await transporter.sendMail({
    from: ENV.EMAIL_USER,
    to: toEmail,
    subject: "Reset Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click below link:</p>
      <a href="${link}">${link}</a>
    `,
  });

  console.log("✅ MAIL SENT");
  console.log(info.response);

  return info;
};
