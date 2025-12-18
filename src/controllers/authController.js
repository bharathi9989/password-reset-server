import { User } from "../models/User.js";
import { generateResetToken } from "../utils/token.js";
import { sendResetEmail } from "../utils/mailer.js";
import { HttpError } from "../core/httpError.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ENV } from "../config/env.js";

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new HttpError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    // Do NOT reveal user existence
    return res.json({ message: "Reset link sent if email exists" });
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
  await sendResetEmail(email, link);

  res.json({ message: "Password reset link sent to email" });
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!token || !password)
    throw new HttpError(400, "Token and password required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new HttpError(400, "Invalid or expired token");

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password updated successfully" });
};

export const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new HttpError(400, "Token is required");
  }

  // Hash incoming token (because DB stores hashed)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(200).json({
      valid: false,
      message: "Token expired or invalid",
    });
  }

  res.status(200).json({
    valid: true,
    message: "Token is valid",
  });
};