import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport(
  MailtrapTransport({
    token: ENV.MAILTRAP_TOKEN,
  }),
);

export const sendResetEmail = async (toEmail, link) => {
  try {
    console.log("📧 MAILTRAP START");

    const info = await transporter.sendMail({
      from: {
        address: ENV.EMAIL_USER,
        name: "Password Reset App",
      },

      to: [toEmail],

      subject: "Reset Password",

      html: `
        <h2>Password Reset</h2>

        <p>Click below to reset password:</p>

        <a href="${link}">
          Reset Password
        </a>

        <br /><br />

        <p>${link}</p>
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
