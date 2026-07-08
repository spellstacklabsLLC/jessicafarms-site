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
  const PORT = 3000;

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
      const { items, email } = req.body;
      const stripeClient = getStripe();

      // Identify bundle items and regular honey items
      const bundleItems: any[] = [];
      const regularItems: any[] = [];

      items.forEach((item: any) => {
        if (item.id.startsWith("bundle-")) {
          bundleItems.push({
            id: item.id,
            quantity: item.quantity,
            name: item.name || "Mix & Match 3-Jar Box",
            description: item.description || "Custom 3-jar honey bundle",
            priceNumber: 34.99,
          });
        } else {
          const product = PRODUCTS.find((p) => p.id === item.id);
          if (!product) {
            throw new Error(`Product with ID ${item.id} not found.`);
          }
          regularItems.push({
            id: item.id,
            quantity: item.quantity,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            priceNumber: product.priceNumber,
          });
        }
      });

      // Calculate target pricing for 3-jar boxes
      // Each box of 3 is $34.99. We do not sell singles.
      const totalRegularQty = regularItems.reduce((sum, item) => sum + item.quantity, 0);
      const regularBaseSubtotalInCents = Math.round(regularItems.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0) * 100);

      const bundlesOf3 = Math.floor(totalRegularQty / 3);
      const targetRegularSubtotalInCents = Math.round((bundlesOf3 * 34.99) * 100);

      // Construct line items
      const lineItems: any[] = [];

      // Process bundleItems first
      bundleItems.forEach((bItem) => {
        const bundleDisplayName = bItem.description
          ? `${bItem.name} — ${bItem.description.replace("Includes: ", "")}`
          : bItem.name;

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: bundleDisplayName,
              description: bItem.description,
              images: [`${req.headers.origin}/assets/bundle-box.png`],
            },
            unit_amount: 3499, // $34.99
          },
          quantity: bItem.quantity,
        });
      });

      // Process regular jars with bulk mix-and-match pricing ratio
      if (regularItems.length > 0) {
        const discountRatio = regularBaseSubtotalInCents > 0 ? targetRegularSubtotalInCents / regularBaseSubtotalInCents : 1;
        let cumulativeCentsSum = 0;

        const preparedRegularLines = regularItems.map((item) => {
          const unitAmountInCents = Math.round(item.priceNumber * discountRatio * 100);
          const lineTotal = unitAmountInCents * item.quantity;
          cumulativeCentsSum += lineTotal;

          return {
            id: item.id,
            quantity: item.quantity,
            name: item.name,
            description: item.description,
            imageUrl: item.imageUrl,
            unit_amount: unitAmountInCents,
          };
        });

        // Rounding discrepancy adjustment
        const discrepancy = targetRegularSubtotalInCents - cumulativeCentsSum;
        if (discrepancy !== 0 && preparedRegularLines.length > 0) {
          const first = preparedRegularLines[0];
          if (first.quantity === 1) {
            first.unit_amount += discrepancy;
          } else {
            const splitQty = first.quantity - 1;
            preparedRegularLines.push({
              id: first.id,
              quantity: 1,
              name: first.name,
              description: first.description,
              imageUrl: first.imageUrl,
              unit_amount: first.unit_amount + discrepancy,
            });
            first.quantity = splitQty;
          }
        }

        // Add regular lines to final lineItems
        preparedRegularLines.forEach((item) => {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                images: [item.imageUrl.startsWith("/") ? `${req.headers.origin}${item.imageUrl}` : item.imageUrl],
                description: item.description,
              },
              unit_amount: item.unit_amount,
            },
            quantity: item.quantity,
          });
        });
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        ...(email ? { customer_email: email } : {}),
        invoice_creation: {
          enabled: true,
        },
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {
          order_items: JSON.stringify(items.map((i: any) => ({
            id: i.id,
            q: i.quantity,
            name: i.name,
            description: i.description
          }))),
          bundle_flavors: items
            .map((i: any) => i.description)
            .filter(Boolean)
            .join(" | ")
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

  // React SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}

startServer();
