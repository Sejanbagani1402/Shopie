import mongoose from "mongoose";
export const paymentMethod = new mongoose.Schema(
  {
    //name, description
    name: {
      type: String,
      required: true,
      unique: true,
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

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethod);
export default PaymentMethod;
