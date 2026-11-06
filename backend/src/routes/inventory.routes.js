
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { Product, StockMovement } from "../models/index.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const data = await Product.findAll({
      attributes: ["id", "sku", "name", "stock", "minStock"],
      where: { isActive: true }
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/low-stock", async (req, res, next) => {
  try {
    const { Op } = await import("sequelize");

    const data = await Product.findAll({
      where: {
        isActive: true,
        stock: { [Op.lte]: Product.sequelize.col("min_stock") }
      }
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/movements", async (req, res, next) => {
  try {
    const data = await StockMovement.findAll({
      include: ["product", "user"],
      order: [["createdAt", "DESC"]],
      limit: 100
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post("/movements", authorize("ADMIN"), (req, res) => {
  res.status(501).json({
    success: false,
    message: "Los movimientos manuales requieren implementar su servicio transaccional"
  });
});

export default router;
