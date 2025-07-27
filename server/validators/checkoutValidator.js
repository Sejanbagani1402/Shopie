import { body } from "express-validator";

export const createCheckoutValidator = [
  body("cart")
    .isArray({ min: 1 })
    .withMessage("Cart must be a non-empty array."),
  body("cart.*.title")
    .isString()
    .withMessage("Each product must have a title."),
  body("cart.*.price")
    .isFloat({ min: 0 })
    .withMessage("Each product must have a valid price."),
  body("cart.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each product must have quantity ≥ 1."),
  body("cart.*.imageURL")
    .optional()
    .isString()
    .withMessage("Image URL must be a string."),
  body("cart.*.description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
];
