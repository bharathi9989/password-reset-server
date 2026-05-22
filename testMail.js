import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

async function testMail() {
  try {
    console.log("EMAIL:", process.env.EMAIL_USER);
    console.log("PASS EXISTS:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    console.log("✅ SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "TEST MAIL",
      html: "<h1>Mail Working</h1>",
    });

    console.log("✅ MAIL SENT");
    console.log(info.response);
  } catch (err) {
    console.log("❌ ERROR");
    console.log(err);
  }
}

testMail();
