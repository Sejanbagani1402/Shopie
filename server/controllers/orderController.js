import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import { createOrderValidator } from "../validators/orderValidator.js";

import { validateShippingAddress } from "../middlewares/orderMiddleware.js";

import {
  calculateOrderTotals,
  convertCartToOrder,
  generateOrderNumber,
  updateProductStocks,
} from "../utils/orderUtils.js";

import { NotFoundError } from "../utils/errors.js";

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
        orderNumber: generateOrderNumber(),
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
            changedBy: req.user._id,
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
export const checkoutCart = [
  validateShippingAddress,
  async (req, res) => {
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
