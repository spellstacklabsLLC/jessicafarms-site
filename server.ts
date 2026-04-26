import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import Stripe from "stripe";
import { PRODUCTS } from "./constants.js"; // Import products for price verification

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe lazily to avoid crashing if key is missing
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
    }
    stripe = new Stripe(key);
  }
  return stripe;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());
  
  // Restrict CORS in production for better security
  const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? [process.env.APP_URL || ""] : true,
    methods: ["GET", "POST"],
  };
  app.use(cors(corsOptions));

  // In-memory highscores storage
  let highscores: { initials: string; score: number; date: string }[] = [
    { initials: "BUT", score: 5000, date: new Date().toISOString() },
    { initials: "CAT", score: 3000, date: new Date().toISOString() },
    { initials: "MOU", score: 1000, date: new Date().toISOString() },
  ];

  // API routes
  app.get("/api/highscores", (req, res) => {
    res.json(highscores.sort((a, b) => b.score - a.score).slice(0, 10));
  });

  app.post("/api/highscores", (req, res) => {
    const { initials, score } = req.body;
    
    // Basic validation to prevent spam/corruption
    if (
      initials && 
      typeof initials === "string" && 
      initials.length <= 3 &&
      typeof score === "number" && 
      score >= 0 && 
      score < 1000000
    ) {
      highscores.push({
        initials: initials.toUpperCase().slice(0, 3),
        score,
        date: new Date().toISOString(),
      });
      // Keep only top 10
      highscores = highscores.sort((a, b) => b.score - a.score).slice(0, 10);
      res.status(201).json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  // Stripe Checkout Session Route
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { items } = req.body;
      const stripeClient = getStripe();

      // SECURITY: Verify prices on the server-side using the PRODUCTS source of truth
      const lineItems = items.map((cartItem: any) => {
        const product = PRODUCTS.find((p) => p.id === cartItem.id);
        if (!product) {
          throw new Error(`Product with ID ${cartItem.id} not found.`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.imageUrl.startsWith("/") ? `${req.headers.origin}${product.imageUrl}` : product.imageUrl],
              description: product.description,
            },
            unit_amount: Math.round(product.priceNumber * 100), // Use server-side price
          },
          quantity: cartItem.quantity,
        };
      });

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        // Optional: Add metadata for order tracking
        metadata: {
          order_items: JSON.stringify(items.map((i: any) => ({ id: i.id, q: i.quantity }))),
        }
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create checkout session" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
