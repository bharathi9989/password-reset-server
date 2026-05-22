import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());

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
