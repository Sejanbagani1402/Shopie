import { validateOrderOwnership } from "../middlewares/orderMiddleware.js";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import { updateStatusValidator } from "../validators/orderValidator.js";

export const updateOrderStatus = [
  updateStatusValidator,
  validateOrderOwnership,
  async (req, res) => {
    try {
      const { statusName, notes } = req.body;
      const order = req.order;
      const newStatus = await OrderStatus.findOne({ name: statusName });
      if (!newStatus) {
        return res.status(404).json({ message: "Invalid Status" });
      }
      order.statusHistory.push({
        status: newStatus._id,
        changedBy: userId,
        notes: notes || `Status changed to ${statusName}`,
      });
      order.currentStatus = newStatus._id;
      await order.save();
      // In future, we will add:
      // 1. email notifications
      // 2. update inventory
      // 3. trigger refund if cancelled
      res.json(order);
    } catch (error) {
      next(error);
    }
  },
];

export const getStatusHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate({ path: "statusHistory.status", select: "name description" })
      .populate({
        path: "statusHistory.changedBy",
        select: "username",
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order.statusHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
