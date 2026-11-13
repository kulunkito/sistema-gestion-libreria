
import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema
} from "../validators/category.validator.js";
import { statusSchema } from "../validators/status.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.post("/", authorize("ADMIN"), validate(createCategorySchema), controller.create);
router.put("/:id", authorize("ADMIN"), validate(updateCategorySchema), controller.update);
router.patch("/:id/status", authorize("ADMIN"), validate(statusSchema), controller.deactivate);

export default router;
