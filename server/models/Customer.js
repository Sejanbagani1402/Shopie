import mongoose from "mongoose";
export const customerSchema = new mongoose.Schema(
  {
    // user, shippingAddress, billingAddress, email, phone,  preferences, loyaltyPoints
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shippingAddresses: [
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    billingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      currency: {
        type: String,
        default: "inr",
      },
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
