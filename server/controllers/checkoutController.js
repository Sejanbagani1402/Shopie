import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Customer from "../models/Customer.js";
import {
  calculateOrderTotals,
  generateOrderNumber,
  updateProductStocks,
} from "../utils/orderUtils.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { cart, paymentMethod, shippingAddressId } = req.body;
    if (!paymentMethod || !shippingAddressId) {
      throw new Error("Payment method and shipping address are required");
    }
    const method = await PaymentMethod.findOne({ name: paymentMethod });
    if (!method) throw new Error("Invalid payment method");

    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) throw new Error("Customer profile not found");

    const shippingAddress = customer.shippingAddresses.id(shippingAddressId);
    if (!shippingAddress)
      throw new Error("Invalid shipping address ID for this customer");

    const items = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));
    const orderData = await calculateOrderTotals(items);
    const order = new Order({
      orderNumber: await generateOrderNumber(),
      customer: customer._id,
      items: orderData.items,
      shippingAddress: shippingAddressId,
      paymentMethod: method._id,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      currentStatus: (await OrderStatus.findOne({ name: "pending_payment" }))
        ._id,
      statusHistory: [
        {
          status: (await OrderStatus.findOne({ name: "pending_payment" }))._id,
          notes: "Order created",
          changedBy: req.user._id,
        },
      ],
    });

    await order.save();
    await updateProductStocks(order, "decrement");

    const line_items = cart.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
          images: [product.imageURL],
          description: product.description,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:5173/success?orderId=${order}`,
      cancel_url: `http://localhost:5173/canceled`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user?._id?.toString() || "guest",
      },
    });

    res.json({
      success: true,
      message: "Checkout session created",
      orderId: order._id,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
