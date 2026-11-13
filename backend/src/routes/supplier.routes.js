import { Router } from "express";
import { suppliersController as controller } from "../controllers/contact.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSupplierSchema, updateSupplierSchema } from "../validators/contact.validator.js";
import { statusSchema } from "../validators/status.validator.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/", controller.list);
router.post("/", validate(createSupplierSchema), controller.create);
router.put("/:id", validate(updateSupplierSchema), controller.update);
router.patch("/:id/status", validate(statusSchema), controller.deactivate);

export default router;
