
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cancelSaleSchema, createSaleSchema } from "../validators/sale.validator.js";
import * as controller from "../controllers/sale.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SELLER"), controller.list);
router.get("/:id", authorize("ADMIN", "SELLER"), controller.getById);
router.post("/", authorize("ADMIN", "SELLER"), validate(createSaleSchema), controller.create);
router.post("/:id/cancel", authorize("ADMIN"), validate(cancelSaleSchema), controller.cancel);

export default router;
