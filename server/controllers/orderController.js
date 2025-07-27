import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import Customer from "../models/Customer.js";
import PaymentMethod from "../models/PaymentMethod.js";
import { createOrderValidator } from "../validators/orderValidator.js";
import { validateShippingAddress } from "../middlewares/orderMiddleware.js";

import {
  calculateOrderTotals,
  convertCartToOrder,
  generateOrderNumber,
  updateProductStocks,
} from "../utils/orderUtils.js";

import { NotFoundError } from "../utils/error.js";

export const createOrder = [
  createOrderValidator,
  validateShippingAddress,
  async (req, res, next) => {
    try {
      const { items, shippingAddressId, paymentMethod } = req.body;
      const customer = req.customer;
      const orderData = await calculateOrderTotals(items);
      let pendingStatus = await OrderStatus.findOne({
        name: "pending_payment",
      });
      const method = await PaymentMethod.findOne({ name: paymentMethod });
      if (!paymentMethod) {
        throw new NotFoundError("Payment method 'card' not found");
      }
      if (!pendingStatus) {
        // Create it if missing (fallback)
        pendingStatus = await OrderStatus.create({
          name: "pending_payment",
          description: "Waiting for payment",
        });
      }

      const order = new Order({
        orderNumber: await generateOrderNumber(),
        customer: customer._id,
        items: orderData.items,
        shippingAddress: shippingAddressId,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shippingFee: orderData.shippingFee,
        total: orderData.total,
        paymentMethod: method._id,
        currentStatus: pendingStatus._id,
        statusHistory: [
          {
            status: pendingStatus._id,
            notes: "Order Created",
            changedBy: req.user._id,
          },
        ],
      });
      await order.save();
      await updateProductStocks(order, "decrement");
      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      next(error);
    }
  },
];
export const checkoutCart = [
  validateShippingAddress,
  async (req, res, next) => {
    try {
      const { shippingAddressId, paymentMethodId } = req.body;
      const order = await convertCartToOrder(
        req.cart._id,
        req.user._id,
        shippingAddressId,
        paymentMethodId
      );
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
];

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId, customerId } = req.params;
    const order = await Order.findOne({ _id: orderId, customer: customerId })
      .populate("currenTStatus", "name description")
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
