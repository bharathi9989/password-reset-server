import express from "express";
import router from "./routes/authRoutes.js";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://password-resetguvi.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes

app.use("/api/auth", router);
app.use(errorHandler);

export default app;
