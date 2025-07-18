import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { NotFoundError } from "../utils/error.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "title price imageURL stocks"
    );
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }
    const verifiedItems = cart.items.map((item) => {
      const available = Math.min(item.quantity, item.product.stocks);
      return {
        ...item.toObject(),
        available,
        canCheckout: available > 0,
      };
    });
    res.json({
      items: verifiedItems,
      total: cart.total,
    });
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const { cart, product } = req;
    const existingItem = cart.item.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.item.push({
        product: productId,
        qunatity,
        priceAtAddition: product.price,
      });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { cart } = req;
    const item = cart.items.id(itemId);
    if (!item) {
      throw new NotFoundError("Cart item not found");
    }
    const product = await Product.findById(item.product);
    if (quantity > product.stocks) {
      throw new Error("Requested quantity exceeded available stocks");
    }
    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { cart } = req;
    const item = cart.items.id(itemId);
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    item.remove();
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};
export const cleanCart = async (req, res, next) => {
  try {
    const { cart } = req;
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
