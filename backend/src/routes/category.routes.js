
import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.post("/", authorize("ADMIN"), controller.create);
router.put("/:id", authorize("ADMIN"), controller.update);

export default router;
