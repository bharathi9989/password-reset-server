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
    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: toEmail,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <a href="${link}">${link}</a>
      `,
    });

    console.log("MAIL SENT:", info.response);

    return info;
  } catch (error) {
    console.log("MAIL ERROR:", error);
    throw error;
  }
};
