import Stripe from "stripe";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { cart } = req.body;

    const line_items = cart.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
          images: [product.imageURL],
          description: product.description,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const orderId = uuidv4();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:5173/success?orderId=${orderId}`,
      cancel_url: `http://localhost:5173/canceled`,
      metadata: {
        orderId,
      },
    });

    res.json({
      success: true,
      message: "Checkout session created",
      orderId,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
