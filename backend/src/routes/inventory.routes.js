
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createMovementSchema } from "../validators/inventory.validator.js";
import * as controller from "../controllers/inventory.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/low-stock", controller.lowStock);
router.get("/movements", controller.movements);
router.post("/movements", authorize("ADMIN"), validate(createMovementSchema), controller.createMovement);

export default router;
