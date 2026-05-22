import express from "express";

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyResetToken,
} from "../controllers/authController.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);

router.post("/login", loginUser);

// PASSWORD RESET ROUTES
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/reset-password/:token", verifyResetToken);

export default router;
