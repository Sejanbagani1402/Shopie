import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import OrderStatus from "../models/OrderStatus.js";
import PaymentMethod from "../models/PaymentMethod.js";

export const createOrderValidator = [
  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isMongoId()
    .withMessage("Invalid Customer Id"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required")
    .custom((items) =>
      items.every(
        (item) => item.product && item.quantity && item.priceAtPurchase
      )
    )
    .withMessage("Each item must have product, quantity, and priceAtpurchase"),
  body("ShippingAddressId")
    .notEmpty()
    .withMessage("Shipping address ID is required")
    .isString()
    .withMessage("Invalid address ID format."),
  body("paymentMethodId")
    .notEmpty()
    .withMessage("Payment method ID is required")
    .isMongoId()
    .withMessage("Invalid Payment method ID format")
    .custom(async (value) => {
      const method = await PaymentMethod.findById(value);
      if (!method) throw new Error("Payment method not found");
      return true;
    }),
  body("notes").optional().isString().withMessage("Notes must be a string"),
];

export const updateStatusValidator = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isMongoId()
    .withMessage("Invalid Order ID format"),
  body("statusName")
    .notEmpty()
    .withMessage("Status name is required")
    .isString()
    .withMessage("Status name must be a string")
    .custom(async (value) => {
      const status = await OrderStatus.findOne({ name: value });
      if (!status) throw new Error("Invalid Status Name");
      return true;
    }),
  body("notes").optional().isString().withMessage("Notes must be a string"),
];

export const orderQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive Integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a between 1 and 100."),
  query("status").optional().isString().withMessage("Status must be a string."),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (YYYY-MM-DD)"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (YYYY-MM-DD)"),
];
