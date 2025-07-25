import { body, param, query } from "express-validator";

export const updateStockAfterOrder = [
  body("orderId").isMongoId().withMessage("Invalid Order id format"),
  body("reason").optional().isString().withMessage("Reason must be a string"),
];
export const restockProducts = [
  body("productUpdates")
    .isArray({ min: 1 })
    .withMessage("At least one product update required"),
  body("productUpdates.*.productId")
    .isMongoId()
    .withMessage("Invalid Product id format"),
  ,
  body("productUpdates.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must at least be 1"),
  ,
];
export const getInventoryHistory = [
  query("productId")
    .optional()
    .isMongoId()
    .withMessage("Invalid product Id format"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 - 100"),
];
export const lowStockValidator = [
  query("threshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Threshold must be a positive integer").toInt,
];
