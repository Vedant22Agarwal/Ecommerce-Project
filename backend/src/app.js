import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // which frontend url are allowed for accessing the server
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// route import
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/orders.routes.js";
import errorHandler from "./middleware/error.middleware.js";

// route declaration
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.use(errorHandler);

export { app };
