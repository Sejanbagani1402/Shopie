import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function calculateOrderTotals(items) {
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== items.length) {
    throw new Error("One or more products not found.");
  }
  let subtotal = 0;
  const validatedItems = items.map((item) => {
    const product = products.find((p) => p._id.equals(items.product));
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
