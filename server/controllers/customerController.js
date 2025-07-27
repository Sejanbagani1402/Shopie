import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import { NotFoundError, ValidationError } from "../utils/error.js";
import mongoose from "mongoose";

export const createCustomer = async (req, res, next) => {
  try {
    const { userId, phone } = req.body;

    // Check if customer already exists for this user
    const existingCustomer = await Customer.findById(userId);
    if (existingCustomer) {
      throw new ValidationError(
        "Customer profile already exists for this user"
      );
    }

    const customer = new Customer({
      user: userId,
      phone,
      shippingAddresses: [],
      billingAddress: null,
      preferences: {
        language: "en",
        currency: "inr",
      },
      loyaltyPoints: 0,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id })
      .populate("user", "username email")
      .populate("shippingAddresses");

    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    res.json({
      ...customer.toObject(),
      email: customer.user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerProfile = async (req, res, next) => {
  try {
    const { phone, preferences } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { user: req.user._id },
      { new: true, runValidators: true }
    ).populate("user", "username email");

    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    res.json({
      ...customer.toObject(),
      email: customer.user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const addShippingAddress = async (req, res, next) => {
  try {
    const { street, city, state, postalCode, country, isDefault } = req.body;

    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    const newAddress = {
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || false,
    };

    // If setting as default, unset other defaults
    if (isDefault) {
      customer.shippingAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    customer.shippingAddresses.push(newAddress);
    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateShippingAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    const address = customer.shippingAddresses.id(addressId);
    if (!address) {
      throw new NotFoundError("Shipping address not found");
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      customer.shippingAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, updates);
    await customer.save();

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const setBillingAddress = async (req, res, next) => {
  try {
    const { street, city, state, postalCode, country } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { user: req.user._id },
      {
        billingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      },
      { new: true }
    );

    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      throw new NotFoundError("Customer profile not found");
    }

    const orders = await Order.find({ customer: customer._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
