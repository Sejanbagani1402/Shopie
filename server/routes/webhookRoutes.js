import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhookController.js";

const router = express.Router();

// Stripe requires raw body, so use express.raw() instead of express.json()
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
