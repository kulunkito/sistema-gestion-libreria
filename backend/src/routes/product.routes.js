
import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema } from "../validators/product.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("ADMIN"), validate(createProductSchema), controller.create);
router.put("/:id", authorize("ADMIN"), controller.update);
router.patch("/:id/status", authorize("ADMIN"), controller.deactivate);

export default router;
