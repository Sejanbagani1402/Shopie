import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { NotFoundError } from "../utils/error.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: "inr",
      metadata: { orderId: order._id.toString() },
      payment_method_types: ["card"],
    });
    const payment = new Payment({
      order: order._id,
      user: order.user._id,
      paymentIntentId: paymentIntent.id,
      amount: order.total,
      status: paymentIntent.status,
      paymentMethod: "card",
    });
    await payment.save();
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};
export const processRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new NotFoundError("Payment not found");
    }
    const refund = await Stripe.RefundsResource.create({
      payment_intent: payment.paymentIntentId,
      amount: Math.round((amount || payable.amount) * 100),
      reason: reason || "requested_by_customer",
    });
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status:
          refund.amount === payment.amount * 100
            ? "refunded"
            : "partially_refunded",
        $push: {
          refunds: {
            amount: refund.amount / 100,
            reason: refund.reason,
            created: new Date(refund.created * 1000),
            status: refund.status,
          },
        },
      },
      { new: true }
    );
    res.json(updatedPayment);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate("order")
      .populate("user", "name email");
    if (!payment) {
      throw new NotFoundError("Payment not found");
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.paymentIntentId
    );
    if (paymentIntent.status !== payment.status) {
      payment.status = paymentIntent.status;
      await payment.save();
    }
    res.json(payment);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};
