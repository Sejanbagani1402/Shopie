import { Router } from "express";
const router = Router();
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
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

    //Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://locahost:5173/success=true",
      cancel_url: "https://locahost:5173/canceled=true",
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
