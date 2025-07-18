import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  priceAtAddition: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

cartSchema.virtual("total").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.priceAtAddition * item.quantity;
  }, 0);
});

cartSchema.set("toJSON", { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
