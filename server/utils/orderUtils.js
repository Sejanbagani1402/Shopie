import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { NotFoundError } from "./error.js";
import OrderStatus from "../models/OrderStatus.js";

export async function calculateOrderTotals(items) {
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== items.length) {
    throw new Error("One or more products not found.");
  }
  let subtotal = 0;
  const validatedItems = items.map((item) => {
    const product = products.find((p) => p._id.equals(item.product));
    if (!product) throw new Error(`Product ${items.product} not found`);
    if (product.stocks < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.title}`);
    }
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    return {
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
      name: product.title,
    };
  });
  const TAX_RATE = 0.08;
  const SHIPPING_FEE = 10.0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_FEE;
  return {
    items: validatedItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shippingFee: SHIPPING_FEE,
    total: parseFloat(total.toFixed(2)),
  };
}
export async function generateOrderNumber() {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  const lastNumber = lastOrder
    ? parseInt(lastOrder.orderNumber.split("-")[1])
    : 0;
  return `ORD-${(lastNumber + 1).toString().padStart(6, "0")}`;
}
export async function updateProductStocks(order, action = "decrement") {
  const operations = order.items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: {
        $inc: {
          stocks: action === "decrement" ? -item.quantity : item.quantity,
        },
      },
    },
  }));
  await Product.bulkWrite(operations);
}

export async function createOrderFromItems(
  userId,
  items,
  shippingAddressId,
  paymentMethodId
) {
  const orderData = await calculateOrderTotals(items);
  const pendingStatus = await OrderStatus.findOne({ name: "pending_payment" });
  const order = new Order({
    orderNumber: await generateOrderNumber(),
    customer: userId,
    items: orderData.items,
    shippingAddress: shippingAddressId,
    ...orderData,
    paymentMethod: paymentMethodId,
    currentStatus: pendingStatus._id,
    statusHistory: [
      {
        status: pendingStatus._id,
        notes: "Order created from Cart",
        changedBy: userId,
      },
    ],
  });
  await order.save();
  await updateProductStocks(Order, "decrement");
  return order;
}

export async function convertCartToOrder(
  cartId,
  userId,
  shippingAddressId,
  paymentMethodId
) {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.user.toString() !== userId.toString()) {
    throw new NotFoundError("Invalid Cart");
  }
  const validatedItems = cart.items.map((item) => {
    if (item.quantity > item.product.stocks) {
      throw new Error(`Insufficient stocks for ${item.product.title} `);
    }
    return {
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAddition,
    };
  });
  const order = await createOrderFromItems(
    userId,
    validatedItems,
    shippingAddressId,
    paymentMethodId
  );
  cart.items = [];
  await cart.save();
  return order;
}
