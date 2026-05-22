import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://password-resetflows-client.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

console.log("🔥 APP STARTED");

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API WORKING");
});

/* ROUTES */
app.use("/api/auth", router);

console.log("🔥 ROUTES LOADED");

/* ERROR HANDLER */
app.use(errorHandler);

export default app;
