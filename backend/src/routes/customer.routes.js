import { Router } from "express";
import { customersController as controller } from "../controllers/contact.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCustomerSchema, updateCustomerSchema } from "../validators/contact.validator.js";
import { statusSchema } from "../validators/status.validator.js";

const router = Router();
router.use(authenticate);
router.get("/", controller.list);
router.post("/", authorize("ADMIN"), validate(createCustomerSchema), controller.create);
router.put("/:id", authorize("ADMIN"), validate(updateCustomerSchema), controller.update);
router.patch("/:id/status", authorize("ADMIN"), validate(statusSchema), controller.deactivate);

export default router;
