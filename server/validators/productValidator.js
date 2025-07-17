import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createProductValidator = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("The product title must be between 2 and 200 characters."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price of product must be positive number."),
  body("imageUrl").isURL().withMessage("Please provide a valid image URL."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed more than 1000 characters."),
  body("category").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid Category ID");
    }
    return true;
  }),
  body("tags")
    .optional()
    .isArray()
    .withMessage("The tags must be an array")
    .custom((tags) => {
      if (!mongoose.Types.ObjectId.isValid(tags)) {
        throw new Error("Invalid product tag");
      }
      return true;
    }),
  body("stocks")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer."),
];
export const updateProductValidator = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid Product id.");
    }
    return true;
  }),
  body("title")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("The product title must be between 2 and 200 characters."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price of product must be positive number."),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid image URL."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed more than 1000 characters."),
  body("category")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Category ID");
      }
      return true;
    }),
  body("stocks")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer."),
];
