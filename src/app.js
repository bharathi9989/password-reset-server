import express from "express";
import router from "./routes/authRoutes.js";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes

app.use("/api/auth", router);
app.use(errorHandler);

export default app;
