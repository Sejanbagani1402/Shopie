import Order from "../models/Order";
import OrderStatus from "../models/OrderStatus";

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

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId, customerId } = req.params;
    const order = await Order.findOne({ _id: orderId, customer: customerId })
      .populate("currenStatus", "name description")
      .populate("items.product", "title price imageURL")
      .populate("paymentMethod", "name")
      .populate({
        paths: "statusHistory.status",
        select: "name description",
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
