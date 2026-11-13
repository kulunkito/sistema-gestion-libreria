import { Router } from "express";
import * as controller from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";
import { z } from "zod";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/roles", controller.roles);
router.get("/", controller.list);
router.post("/", validate(createUserSchema), controller.create);
router.put("/:id", validate(updateUserSchema), controller.update);
router.patch("/:id/status", validate(z.object({ isActive: z.boolean() })), controller.setStatus);

export default router;
