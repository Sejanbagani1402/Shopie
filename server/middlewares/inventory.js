import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { NotFoundError, ValidationError } from "../utils/error.js";

export const validateProductExist = async (req, res, next) => {
  try {
    const { productUpdates } = req.body;
    const productIds = productUpdates.map((u) => u.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      const missingIds = productIds.filter(
        (id) => !products.some((p) => p._id.equals(id))
      );
      throw new NotFoundError("Some products not found", {
        missingProducts: missingIds,
      });
    }
    req.products = products;
  } catch (error) {
    next(error);
  }
};
export const checkStockAvailability = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.product");
    for (const item of order.items) {
      if (item.product.stocks < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for ${item.product.title}`,
          { productId: item.product._id }
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
