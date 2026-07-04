import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import connectDB from "./config/mongodb.js";
import { app } from "./app.js";

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
});

app.get("/", (req, res) => {
  res.send("API Working");
});

export default app;