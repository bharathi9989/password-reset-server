import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  refreshToken: { type: String },
});

export const User = mongoose.model("User", userSchema);
