
import dotenv from "dotenv"
dotenv.config();

import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"
import { ENV } from "./src/config/env.js"


// connected to db
connectDB()
app.listen(ENV.PORT, () => {
  console.log(`Application Running on ${ENV.PORT}`)
})