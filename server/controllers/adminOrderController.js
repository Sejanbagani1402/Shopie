import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      customerId,
      dateFrom,
      dateTo,
    } = req.query;
    const query = {};
    if (status) {
      const statusDoc = await OrderStatus.findOne({ name: status });
      if (statusDoc) {
        query.currentStatus = statusDoc._id;
      }
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    const orders = await Order.find(query)
      .populate("customer", "user")
      .populate("currentStatus", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const count = await Order.countDocuments(query);

    res.json({
      data: orders,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const adminUpdateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, notes } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (notes) {
      order.notes = order.notes ? `${order.notes}\n${notes}` : notes;
    }
    await order.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
