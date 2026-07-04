import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectDB from "./config/mongodb.js";
import express from "express";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("ERROR :", error);
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO_DB connection failed !!!!", error);
  });
