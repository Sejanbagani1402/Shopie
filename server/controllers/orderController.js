import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import Customer from "../models/Customer.js";
import OrderStatus from "../models/OrderStatus.js";
import {
  createOrderValidator,
  updateStatusValidator,
} from "../validators/orderValidator.js";

import {
  validateOrderOwnership,
  validateShippingAddress,
} from "../middlewares/orderMiddleware.js";

import {
  calculateOrderTotals,
  generateOrderNumber,
  updateProductStocks,
} from "../utils/orderUtils.js";

export const createOrder = [
  createOrderValidator,
  validateShippingAddress,
  async (req, res, next) => {
    try {
      const { customerId, items, shippingAddressId, paymentMethodId } =
        req.body;
      const orderData = await calculateOrderTotals(items);
      const pendingStatus = await OrderStatus.findOne({
        name: "pending_payment",
      });

      const order = new Order({
        customer: customerId,
        items: orderData.items,
        shippingAddress: shippingAddressId,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shippingFee: orderData.shippingFee,
        total: orderData.total,
        paymentMethod: paymentMethodId,
        currentStatus: pendingStatus._id,
        statusHistory: [
          {
            status: pendingStatus._id,
            notes: "Order Created",
          },
        ],
      });
      await Order.save();
      await updateProductStocks(order, "decrement");
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
];

async function calculateOrderTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 10;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shippingFee;
  return { items, subtotal, shippingFee, tax, total };
}
