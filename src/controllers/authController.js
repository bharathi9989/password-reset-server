import { User } from "../models/User.js";
import { generateResetToken } from "../utils/token.js";
import { sendResetEmail } from "../utils/mailer.js";
import { HttpError } from "../core/httpError.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ENV } from "../config/env.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashed });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  console.log("STEP 1 - API HIT");

  try {
    const { email } = req.body;
    console.log("STEP 2 - BODY", email);

    const user = await User.findOne({ email });
    console.log("STEP 3 - USER", user?.email);

    if (!user) {
      console.log("STEP 4 - NO USER");
      return res.json({ message: "No user" });
    }

    const rawToken = generateResetToken();
    console.log("STEP 5 - TOKEN GENERATED");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    console.log("STEP 6 - TOKEN HASHED");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    console.log("STEP 7 - BEFORE SAVE");

    await user.save();

    console.log("STEP 8 - AFTER SAVE");

    const link = `http://localhost:5173/reset-password/${rawToken}`;
    console.log("STEP 9 - LINK", link);

    // ❌ COMMENT MAIL TEMPORARILY
    // sendResetEmail(email, link)

    console.log("STEP 10 - BEFORE RESPONSE");

    res.json({ message: "DONE SUCCESS" });

    console.log("STEP 11 - AFTER RESPONSE");
  } catch (err) {
    console.error("💥 ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

/* ================= VERIFY TOKEN ================= */
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        valid: false,
        message: "Token expired or invalid",
      });
    }

    res.json({
      valid: true,
      message: "Token is valid",
    });
  } catch (err) {
    next(err);
  }
};
