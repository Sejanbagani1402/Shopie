import Stripe from "stripe";
import Payment from "../models/Payment.js";
import { updateOrderStatus } from "./orderController.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;
      case "charge.refunded":
        await handleChargeRefund(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook:`, error);
    res.status(500).json({ error: error.message });
  }
};

async function handlePaymentIntentSucceeded(paymentIntent) {
  const payment = await Payment.findOneAndUpdate(
    {
      paymentIntentId: paymentIntent.id,
    },
    {
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    },
    {
      new: true,
    }
  ).populate("order");
  if (!payment) {
    console.error(`Payment not found for intent: ${paymentIntent.id}`);
    return;
  }
  await updateOrderStatus({
    params: { orderId: payment.order._id },
    body: { statusName: "processing" },
    user: { _id: payment.user },
  });
}
async function handlePaymentIntentFailed(paymentIntent) {
  await Payment.findOneAndUpdate(
    {
      paymentIntentId: paymentIntent.id,
    },
    {
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    }
  );
}
async function handleChargeRefund(charge) {
  const payment = await Payment.findOneAndUpdate(
    {
      paymentIntentId: paymentIntent.id,
    },
    {
      status: charge.refunded ? "refunded" : "partially_refunded",
      $push: {
        refunds: charge.refunds.data.map((refund) => ({
          amount: refund.amount,
          reason: refund.reason,
          created: new Date(refund.created * 1000),
          status: refund.status,
        })),
      },
    },
    { new: true }
  );
  if (payment && charge.refunded) {
    await updateOrderStatus({
      params: { orderId: payment.order },
      body: { statusName: "refunded" },
      user: { _id: payment.user },
    });
  }
}
