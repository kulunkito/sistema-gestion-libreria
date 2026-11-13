import { Router } from "express";
import * as controller from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { reportQuerySchema } from "../validators/report.validator.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/sales-summary", validate(reportQuerySchema, "query"), controller.summary);
router.get("/top-products", validate(reportQuerySchema, "query"), controller.topProducts);

export default router;
