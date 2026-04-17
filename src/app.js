import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://password-resetflows-client.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ THIS IS ENOUGH (no app.options needed)
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", router);

// Error handler
app.use(errorHandler);

export default app;
