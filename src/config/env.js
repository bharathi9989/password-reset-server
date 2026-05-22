import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
  MAIL_HOST: process.env.MAIL_HOST,

  MAIL_PORT: process.env.MAIL_PORT,

  MAIL_USER: process.env.MAIL_USER,

  MAIL_PASS: process.env.MAIL_PASS,
};
