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
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Reset link sent if email exists",
      });
    }

    const rawToken = generateResetToken();

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const link = `${ENV.CLIENT_URL}/reset-password/${rawToken}`;

    // SEND MAIL WITHOUT BLOCKING RESPONSE
    sendResetEmail(email, link).catch((err) => {
      console.log(err);
    });

    return res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    next(error);
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
