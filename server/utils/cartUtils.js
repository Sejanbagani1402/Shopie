import Cart from "../models/Cart.js";

export async function mergeCarts(userId, sessionCart) {
  const userCart =
    (await Cart.findOne({ user: userId })) || new Cart({ user: userId });
  if (sessionCart && sessionCart.items.length > 0) {
    for (const sessionItem of sessionCart.items) {
      const existingItem = userCart.items.find(
        (item) => item.product.toString === sessionItem.product.toString()
      );
      if (existingItem) {
        existingItem.quantity += sessionItem.quantity;
      } else {
        userCart.items.push(sessionItem);
      }
    }
    await UserActivation.save();
  }
  return userCart;
}

export async function validateCartItems(cart) {
  return cart.items.map((item) => {
    const available = Math.min(item.quantity, item.product.stocks);
    return {
      ...item.toObject(),
      available,
      canCheckout: available > 0,
    };
  });
}
