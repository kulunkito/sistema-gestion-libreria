
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Libreria API funcionando"
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
