import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "https://password-resetguvi.netlify.app",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ROUTES
app.use("/api/auth", router);

// ERROR HANDLER (ALWAYS LAST)
app.use(errorHandler);

export default app;
