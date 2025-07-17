import { body } from "express-validator";

//registerValidator
export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 to 20 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contains letters, number and underscores"),
  body("email")
    .isEmail()
    .withMessage("Please provide a email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be at least 8 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least a lowercase, a uppercase and a number."
    ),
];

//loginValidator
export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password cannot be empty."),
];
//refreshTOkenValidator
export const refreshTokenValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required."),
];
