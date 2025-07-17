import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { NotFoundError, ForbiddenError } from "../utils/error.js";
import OrderStatus from "../models/OrderStatus.js";

export const validateOrderOwnership = async (req, res, next) => {
  try {
    const { orderId, customerId } = req.params;
    const order = await Order.findById(orderId);
    if (!orderId) {
      throw new NotFoundError("Order not found");
    }
    if (req.user.role === "admin") {
      req.order = order;
      return next();
    }
    if (order.customer.toString() !== customerId) {
      throw new ForbiddenError(
        "You don't have permission to access this order"
      );
    }
    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
};
export const validateShippingAddress = async (req, res) => {
  try {
    const { shippingAddressId, customerId } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    const addressExists = customer.shippingAddresses.some(
      (addr) => addr._id.toString() === shippingAddressId
    );
    if (!addressExists) {
      throw new NotFoundError("Shipping address not found for this customer");
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const checkOrderStatus = (allowedStatuses) => {
  return async (req, res, next) => {
    try {
      const order = req.order || (await Order.findById(req.params.orderId));
      const statusDoc = await OrderStatus.findById(order.currentStatus);
      if (!allowedStatuses.includes(statusDoc.name)) {
        throw new ForbiddenError(
          `Order must be in one of these statuses: ${allowedStatuses.join(
            ", "
          )}`
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
