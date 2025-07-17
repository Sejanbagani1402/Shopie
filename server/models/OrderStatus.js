import mongoose from "mongoose";
export const orderStatusSchema = new mongoose.Schema(
  {
    //name, description
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "pending_payment",
        "processing",
        "on_hold",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "failed",
      ],
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);
export default OrderStatus;
