import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createTagValidator = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Tag name must be between 3 and 20 characters."),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Invalid hex color code given."),
];
export const updateTagValidator = [
  param("id").isMongoId().withMessage("Invalid Tag id."),
  body("name")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Tag name must be between 3 and 20 characters."),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Invalid hex color code given."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];
