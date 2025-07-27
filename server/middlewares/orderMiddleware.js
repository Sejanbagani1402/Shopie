import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { NotFoundError, ForbiddenError } from "../utils/error.js";
import OrderStatus from "../models/OrderStatus.js";

export const validateOrderOwnership = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    if (req.user.role === "admin") {
      req.order = order;
      return next();
    }
    //
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    if (order.customer.toString() !== customer._id.toString()) {
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
export const validateShippingAddress = async (req, res, next) => {
  try {
    const { shippingAddressId, customerId } = req.body;
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    if (shippingAddressId) {
      const addressExists = customer.shippingAddresses.some(
        (addr) => addr._id.toString() === shippingAddressId
      );

      if (!addressExists) {
        throw new NotFoundError("Shipping address not found for this customer");
      }
    }

    req.customer = customer;

    next();
  } catch (error) {
    console.log(error);
    next();
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
