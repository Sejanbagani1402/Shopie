import Product from "../models/Product.js";
import InventoryHistory from "../models/Inventory.js";
import Order from "../models/order.js";
import { NotFoundError, ValidationError } from "../utils/error.js";

export const updateStockAfterOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) throw new NotFoundError("Order not found");

    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (!product) continue;
      if (product.stocks < item.quantity) {
        throw new ValidationError(`Insufficient stock for ${product.title}`);
      }
      const previousStock = product.stocks;
      product.stocks -= item.quantity;
      updates.push(
        product.save(),
        InventoryHistory.create({
          product: product._id,
          quantityChange: -item.quantity,
          previousStock,
          newStock: product.stocks,
          reason: "order",
          reference: order._id,
          changedBy: userId,
        })
      );
      await Promise.all(updates);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};
export const restockProducts = async (req, res) => {
  try {
    const { productUpdates } = req.body;
    const userId = req.user._id;
    if (!Array.isArray(productUpdates) || productUpdates.length === 0) {
      throw new ValidationError("Invalid product updates format");
    }
    const results = await Promise.all(
      productUpdates.map(async (update) => {
        const product = await Product.findById(update.productId);
        if (!product)
          return { productId: update.productId, status: "Not found" };
        const previousStock = product.stocks;
        product.stocks += update.quantity;
        product.lastRestocked = Date.now();
        await Promise.all([
          product.save(),
          InventoryHistory.create({
            product: product._id,
            quantityChange: update.quantity,
            previousStock,
            newStock: product.stocks,
            reason: "restock",
            changedBy: userId,
          }),
        ]);
        return {
          productId: product._id,
          status: "success",
          newStock: product.stocks,
        };
      })
    );
    res.json(results);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};
export const getInventoryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId } = req.body;
    const query = productId ? { product: productId } : {};
    const history = await InventoryHistory.find(query)
      .populate("product", "title")
      .populate("changedBy", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await InventoryHistory.countDocuments(query);
    return {
      data: history,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    };
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getLowStockProducts = async (req, res) => {
  try {
    const query = threshold
      ? { stocks: { $lte: threshold } }
      : { $expr: { $lte: ["$stocks", "$lowStockThreshold"] } };
    return await Product.find(query)
      .select("title stock lowStockThreshold")
      .sort({ stocks: 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
