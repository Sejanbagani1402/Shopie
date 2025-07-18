import { body, params } from "express-validator";
import mongoose from "mongoose";

export const addToCartValidator = [
  body("productID")
    .notEmpty("Product ID is required")
    .withMessage()
    .isMongoId("Invalid Product ID format")
    .withMessage(),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity at least be 1.")
    .toInt(),
];

export const updateCartItemValidator = [
  body("itemID")
    .notEmpty("Item ID is required")
    .withMessage()
    .isMongoId("Invalid Item ID format")
    .withMessage(),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity at least be 1.")
    .toInt(),
];

export const removeCartItemValidator = [
  body("itemID")
    .notEmpty("Item ID is required")
    .withMessage()
    .isMongoId("Invalid Item ID format")
    .withMessage(),
];
