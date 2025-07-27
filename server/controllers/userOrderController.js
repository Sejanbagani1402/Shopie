import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";

export const getUserOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { customer: customerId };
    if (status) {
      const statusDoc = await OrderStatus.findOne({ name: status });
      if (statusDoc) {
        query.currentStatus = statusDoc._id;
      }
    }
    const orders = await Order.find(query)
      .populate("current status", "name")
      .populate("items.product", "title price imageURL")
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
