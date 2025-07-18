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

import { validate } from "../middlewares/validation.js";
import { auth } from "../middlewares/auth.js";
import { getOrCreateCart, validateCartItem } from "../middlewares/cart.js";

const router = express.Router();

router.use(auth);
router.use(getOrCreateCart);

router.get("/", getCart);

router.post(
  "/items",
  validate(addToCartValidator),
  validateCartItem,
  addToCart
);

router.put("/items/:itemId", validate(updateCartItemValidator), updateCartItem);

router.delete(
  "/items/:itemId",
  validate(removeCartItemValidator),
  removeCartItem
);

router.delete("/clear", cleanCart);

export default router;
