
import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  safeUpdateProductSchema
} from "../validators/product.validator.js";
import { statusSchema } from "../validators/status.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("ADMIN"), validate(createProductSchema), controller.create);
router.put("/:id", authorize("ADMIN"), validate(safeUpdateProductSchema), controller.update);
router.patch("/:id/status", authorize("ADMIN"), validate(statusSchema), controller.setStatus);

export default router;
