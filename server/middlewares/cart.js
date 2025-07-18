import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { NotFoundError } from "../utils/error.js";

export const getOrCreateCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id });
      await cart.save();
    }
    req.cart = cart;
    next();
  } catch (error) {
    next(error);
  }
};
export const validateCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    if (product.stocks < (req.body.quantity || 1)) {
      throw new Error("Insufficient stock available");
    }
  } catch (error) {
    next(error);
  }
};
