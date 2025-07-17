import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createCategoryValidator = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category myst be between 3 and 100 characters."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("The category description cannot exceed 200 characters."),
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id."),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Category description cannot exceed 200 characters."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];
