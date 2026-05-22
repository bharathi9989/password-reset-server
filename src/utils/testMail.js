import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function test() {
  try {
    console.log("STARTING TEST");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "TEST MAIL",
      text: "MAIL WORKING",
    });

    console.log("SUCCESS");
    console.log(info);
  } catch (err) {
    console.log("FAILED");
    console.log(err);
  }
}

test();
