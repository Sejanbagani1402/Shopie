import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    amount: Number,
    reason: String,
    created: Date,
    status: String,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    //order, user, paymentIntentId, amount, currency, status, paymentMethod, refunds, metadata
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    status: {
      type: String,
      enum: [
        "requires_payment_method",
        "requires_confirmation",
        "processing",
        "requires_action",
        "succeeded",
        "canceled",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      required: true,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    refunds: [refundSchema],
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, order: 1 });
paymentSchema.index({ status: 1 });
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
