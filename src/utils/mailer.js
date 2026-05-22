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
    console.log("STEP 1");

    await transporter.verify();

    console.log("STEP 2 SMTP READY");

    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: toEmail,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <a href="${link}">${link}</a>
      `,
    });

    console.log("STEP 3 MAIL SENT");

    return info;
  } catch (error) {
    console.log("FULL MAIL ERROR");
    console.log(error);

    throw error;
  }
};
