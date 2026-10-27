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

      // Build Stripe line items: Hot Honey is $14.00, and all creamed honeys are $10.00 each
      const lineItems: any[] = [];

      items.forEach((item: any) => {
        if (item.id === "hot-honey" || item.id === "hot-honey-single") {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: "Jessica Farms Hot Honey",
                description: "Made with real honey, habanero & ghost peppers. Sweet heat with a serious kick.",
                images: [`${req.headers.origin}/assets/hot-honey.jpg`],
              },
              unit_amount: 1400, // $14.00
            },
            quantity: item.quantity,
          });
        } else {
          const product = PRODUCTS.find((p) => p.id === item.id);
          const name = product?.name || item.name || "Creamed Honey";
          const description = product?.description || item.description || "Small-batch creamed honey (5oz jar)";
          const imageUrl = product?.imageUrl || item.imageUrl || '/assets/regular-honey.jpg';

          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name,
                description,
                images: [imageUrl.startsWith("http") ? imageUrl : `${req.headers.origin}${imageUrl}`],
              },
              unit_amount: 1000, // $10.00 each
            },
            quantity: item.quantity,
          });
        }
      });

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
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 999, // $9.99 flat rate shipping
                currency: "usd",
              },
              display_name: "Standard Flat Rate Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {
          order_items: JSON.stringify(items.map((i: any) => ({
            id: i.id,
            q: i.quantity,
            name: i.name,
            description: i.description
          }))),
          item_details: items
            .map((i: any) => `${i.name} (${i.quantity}x)`)
            .join(" | ")
        }
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create checkout session" });
    }
  });

  // In-memory wholesale orders store so backend can track all retail orders & customer details
  interface WholesaleOrderRecord {
    id: string;
    createdAt: string;
    cases: number;
    totalJars: number;
    totalCents: number;
    totalFormatted: string;
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    taxId?: string;
    shippingAddress: {
      street: string;
      aptSuite?: string;
      city: string;
      state: string;
      zip: string;
    };
    notes?: string;
    stripeSessionId?: string;
    stripeCustomerId?: string;
    status: "pending_checkout" | "completed";
  }

  const wholesaleOrders: WholesaleOrderRecord[] = [];

  // API route to retrieve wholesale orders for the farm
  app.get("/api/wholesale-orders", (req, res) => {
    res.json(wholesaleOrders);
  });

  // Dedicated Wholesale Stripe Checkout Session Route
  // Streamlined to collect shipping and customer info securely on Stripe with Free Shipping included
  app.post("/api/create-wholesale-checkout-session", async (req, res) => {
    try {
      const { cases, pails, email } = req.body;

      // Backend validation of quantities
      const numCases = Math.max(0, Math.floor(Number(cases) || 0));
      const numPails = Math.max(0, Math.floor(Number(pails) || 0));

      if (numCases + numPails < 1) {
        return res.status(400).json({ error: "Order must contain at least 1 case or 1 food service pail." });
      }
      if (numCases > 500 || numPails > 200) {
        return res.status(400).json({ error: "For high-volume bulk orders exceeding 500 cases or 200 pails, please contact the farm directly." });
      }

      // Exact Backend Wholesale Pricing (Never trusting client-supplied prices)
      const CASE_PRICE_CENTS = 16000; // $160.00 per case of 20 bottles ($8.00/bottle)
      const PAIL_PRICE_CENTS = 28000; // $280.00 per 42-pound food service pail
      const BOTTLES_PER_CASE = 20;

      const totalCents = (numCases * CASE_PRICE_CENTS) + (numPails * PAIL_PRICE_CENTS);
      const subtotalFormatted = (totalCents / 100).toFixed(2);

      const orderId = `WHOLESALE-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const stripeClient = getStripe();
      const origin = req.headers.origin || `http://localhost:${PORT}`;

      const line_items: any[] = [];

      if (numCases > 0) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Jessica Farms Hot Honey — Wholesale Case (20 Bottles)",
              description: `Wholesale Case Pack: ${numCases} case${numCases > 1 ? "s" : ""} (${numCases * BOTTLES_PER_CASE} total 5oz bottles) at $160.00/case ($8.00/bottle). Free Shipping included.`,
              images: [`${origin}/assets/hot-honey.jpg`],
            },
            unit_amount: CASE_PRICE_CENTS,
          },
          quantity: numCases,
        });
      }

      if (numPails > 0) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Jessica Farms Hot Honey — 42 lb Food Service Pail",
              description: `Food Service Bulk Pail: ${numPails} pail${numPails > 1 ? "s" : ""} (42 lbs pure hot honey) at $280.00/pail. Commercial grade with airtight lid. Free Shipping included.`,
              images: [`${origin}/assets/hot-honey.jpg`],
            },
            unit_amount: PAIL_PRICE_CENTS,
          },
          quantity: numPails,
        });
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        ...(email ? { customer_email: email } : {}),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0, // Free Shipping for wholesale orders
                currency: "usd",
              },
              display_name: "Free Shipping (Included with Wholesale)",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        invoice_creation: {
          enabled: true,
        },
        success_url: `${origin}/wholesale?success=true&session_id={CHECKOUT_SESSION_ID}&cases=${numCases}&pails=${numPails}`,
        cancel_url: `${origin}/wholesale?canceled=true`,
        metadata: {
          order_id: orderId,
          order_type: "wholesale",
          case_quantity: String(numCases),
          pail_quantity: String(numPails),
          total_bottles: String(numCases * BOTTLES_PER_CASE),
          shipping: "Free Shipping (Included)",
          total_paid: `$${subtotalFormatted}`,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe Wholesale Error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to create wholesale checkout session",
      });
    }
  });

  // Wholesale Session Status Route (to display verified receipt details on confirmation)
  app.get("/api/wholesale-session/:sessionId", async (req, res) => {
    try {
      const stripeClient = getStripe();
      const session = await stripeClient.checkout.sessions.retrieve(req.params.sessionId);
      res.json({
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email || session.customer_details?.email,
        amount_total: session.amount_total,
        metadata: session.metadata,
      });
    } catch (error) {
      res.status(404).json({ error: "Session not found" });
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
