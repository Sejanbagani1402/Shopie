import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validation.js";
import { createCheckoutValidator } from "../validators/checkoutValidator.js";
import { createCheckoutSession } from "../controllers/checkoutController.js";

const router = Router();

router.post(
  "/",
  createCheckoutValidator,
  handleValidationErrors,
  createCheckoutSession
);

export default router;
