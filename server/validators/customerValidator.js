import { body, param } from "express-validator";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";

// Common validation for address fields
const addressValidation = [
  body("street").trim().notEmpty().withMessage("Street address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),
  body("country").trim().notEmpty().withMessage("Country is required"),
];

export const validateCreateCustomer = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format")
    .custom(async (userId) => {
      const exists = await Customer.exists({ user: userId });
      if (exists) throw new Error("Customer profile already exists");
      return true;
    }),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
];

export const validateUpdateProfile = [
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  body("preferences.language")
    .optional()
    .isIn(["en", "es", "fr", "de", "it"])
    .withMessage("Invalid language preference"),
  body("preferences.currency")
    .optional()
    .isIn(["usd", "eur", "gbp", "inr", "jpy"])
    .withMessage("Invalid currency preference"),
];

export const validateAddShippingAddress = [
  ...addressValidation,
  body("isDefault").optional().isBoolean(),
];

export const validateUpdateShippingAddress = [
  param("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID format"),
  ...addressValidation,
  body("isDefault").optional().isBoolean(),
];

export const validateSetBillingAddress = addressValidation;
