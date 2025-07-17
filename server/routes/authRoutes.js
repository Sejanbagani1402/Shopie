import { Router } from "express";
const router = Router();

import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "../validators/authValidator.js";

import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate } from "../middlewares/auth.js";

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.post(
  "/refresh",
  refreshTokenValidator,
  handleValidationErrors,
  refreshToken
);
router.post("/logout", logout);

router.get("/profile", authenticate, getProfile);

export default router;
