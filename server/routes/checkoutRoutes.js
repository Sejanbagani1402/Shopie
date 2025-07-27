import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validation.js";
import { createCheckoutValidator } from "../validators/checkoutValidator.js";
import { createCheckoutSession } from "../controllers/checkoutController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, createCheckoutSession);

export default router;
