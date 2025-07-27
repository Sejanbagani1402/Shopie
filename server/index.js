// Server setup
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//db
import { connectDB } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
//
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { version } from "mongoose";

const app = express();

//connect db
connectDB();

app.use(cors());
app.use(json({ limit: "10kb", strict: true }));

//welcome to the server
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the shopie server. Are you invited??",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products",
      categories: "/api/v1/categories",
      tags: "/api/v1/tags",
      checkout: "/api/v1/checkout",
    },
  });
});

//
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/cart", cartRoutes);

app.use(errorHandler);

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is live on http://localhost:${port}`);
});
