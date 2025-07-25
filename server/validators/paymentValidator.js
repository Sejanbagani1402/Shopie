import { body, params } from "express-validator";

export const createPaymentValidator = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID format"),
];
export const refundValidator = [
  body("paymentId")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isMongoId()
    .withMessage("Invalid Payment ID format"),
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be at least 0.01")
    .toFloat(),
  body("reason")
    .optional()
    .isString()
    .withMessage("Reason must be a string")
    .isIn(["duplicate", "fraudulent", "requested_by_customer", "other"])
    .withMessage("Invalid refund reason"),
];
export const paymentStatusValidator = [
  body("paymentId")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isMongoId()
    .withMessage("Invalid Payment ID format"),
];
