import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

export const sendResetEmail = async (toEmail, link) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: toEmail,
    subject: "Reset Your Password",
    html: `
      <p>You requested a password reset.</p>
      <p>This link expires in 15 minutes:</p>
      <a href="${link}">${link}</a>
    `,
  });
};
