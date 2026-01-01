import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/authController.js";
import { asyncHandler } from "../core/asyncHandler.js";


const router = express.Router();
// Routes 

router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));
router.get("/reset-password/:token", asyncHandler(verifyResetToken));


export default router;
