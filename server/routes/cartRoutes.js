import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  cleanCart,
} from "../controllers/cartController.js";

import {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} from "../validators/cartValidators.js";

import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate } from "../middlewares/auth.js";
import { getOrCreateCart, validateCartItem } from "../middlewares/cart.js";

const router = express.Router();

router.use(authenticate);
router.use(getOrCreateCart);

router.get("/", getCart);

router.post(
  "/items",
  addToCartValidator,
  handleValidationErrors,
  validateCartItem,
  addToCart
);

router.put(
  "/items/:itemId",
  updateCartItemValidator,
  handleValidationErrors,
  updateCartItem
);

router.delete(
  "/items/:itemId",
  removeCartItemValidator,
  handleValidationErrors,
  removeCartItem
);

router.delete("/clear", cleanCart);

export default router;
