
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

// Se conectarán los controladores de ventas en TASK-051 a TASK-060.
// No se registra una venta sin la implementación transaccional.

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Módulo de ventas pendiente de implementación"
  });
});

router.post("/", authorize("ADMIN", "SELLER"), (req, res) => {
  res.status(501).json({
    success: false,
    message: "Registro de ventas todavía no implementado"
  });
});

export default router;
