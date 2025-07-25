import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { NotFoundError, ForbiddenError } from "../utils/error.js";

export const validatePaymentOwnership = async (req, res, next) => {
  try {
    const payment = await Payment.findById(
      req.params.paymentId || req.body.paymentId
    );
    if (!payment) {
      throw new NotFoundError("Payment not found");
    }
    if (req.user.role === "admin") {
      req.payment = payment;
      return next();
    }
    if (payment.user.toString() !== req.user._id.toString()) {
      throw new ForbiddenError(
        "You don't have permission to access this payment"
      );
    }
    req.payment = payment;
    next();
  } catch (error) {
    next(error);
  }
};
export const validateOrderForPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      throw new ForbiddenError(
        "You don't have permission to access this order"
      );
    }
    const existingPayment = await Payment.findOne({ order: order._id });
    if (
      existingPayment &&
      ["succeeded", "processing"].includes(existingPayment.status)
    ) {
      throw new Error("This order already has a completed payment");
    }
    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
};
