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
  // IMPORTANT: Calculates and validates wholesale pricing on the backend.
  app.post("/api/create-wholesale-checkout-session", async (req, res) => {
    try {
      const {
        cases,
        businessName,
        contactName,
        email,
        phone,
        taxId,
        shippingAddress,
        notes,
      } = req.body;

      // Backend validation of case quantity
      const numCases = Math.floor(Number(cases));
      if (isNaN(numCases) || numCases < 1) {
        return res.status(400).json({ error: "Order must contain at least 1 case." });
      }
      if (numCases > 500) {
        return res.status(400).json({ error: "For orders exceeding 500 cases, please contact the farm directly." });
      }

      // Backend validation of required fields
      if (!businessName || !businessName.trim()) {
        return res.status(400).json({ error: "Business name is required." });
      }
      if (!contactName || !contactName.trim()) {
        return res.status(400).json({ error: "Contact name is required." });
      }
      if (!email || !email.trim() || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email address is required." });
      }
      if (!phone || !phone.trim()) {
        return res.status(400).json({ error: "Phone number is required." });
      }
      if (
        !shippingAddress ||
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.zip
      ) {
        return res.status(400).json({ error: "Full shipping address is required." });
      }

      // Exact Backend Wholesale Calculations (Never trusting client-supplied prices)
      const JARS_PER_CASE = 20;
      const CASE_PRICE_CENTS = 13980; // $139.80 per case ($6.99/jar * 20 jars)
      const totalJars = numCases * JARS_PER_CASE;
      const totalCents = numCases * CASE_PRICE_CENTS;
      const subtotalFormatted = (totalCents / 100).toFixed(2);

      const orderId = `WHOLESALE-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Create new backend order record with full contact details and shipping info
      const orderRecord: WholesaleOrderRecord = {
        id: orderId,
        createdAt: new Date().toISOString(),
        cases: numCases,
        totalJars,
        totalCents,
        totalFormatted: `$${subtotalFormatted}`,
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        taxId: (taxId || "").trim() || undefined,
        shippingAddress: {
          street: shippingAddress.street.trim(),
          aptSuite: (shippingAddress.aptSuite || "").trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim().toUpperCase(),
          zip: shippingAddress.zip.trim(),
        },
        notes: (notes || "").trim(),
        status: "pending_checkout",
      };

      wholesaleOrders.unshift(orderRecord);

      console.log(`[Backend Wholesale Order Registered]`);
      console.log(`  ID: ${orderRecord.id}`);
      console.log(`  Business: ${orderRecord.businessName}${orderRecord.taxId ? ` (Tax/EIN: ${orderRecord.taxId})` : ""}`);
      console.log(`  Contact: ${orderRecord.contactName} | Phone: ${orderRecord.phone} | Email: ${orderRecord.email}`);
      console.log(`  Shipping: ${orderRecord.shippingAddress.street} ${orderRecord.shippingAddress.aptSuite}, ${orderRecord.shippingAddress.city}, ${orderRecord.shippingAddress.state} ${orderRecord.shippingAddress.zip}`);
      console.log(`  Quantity: ${orderRecord.cases} Cases (${orderRecord.totalJars} Jars) — Total: ${orderRecord.totalFormatted}`);
      if (orderRecord.notes) {
        console.log(`  Notes: ${orderRecord.notes}`);
      }

      const stripeClient = getStripe();
      const origin = req.headers.origin || `http://localhost:${PORT}`;

      const fullShippingAddressString = `${shippingAddress.street.trim()}${shippingAddress.aptSuite ? " " + shippingAddress.aptSuite.trim() : ""}, ${shippingAddress.city.trim()}, ${shippingAddress.state.trim().toUpperCase()} ${shippingAddress.zip.trim()}`;

      // Optionally create/attach Stripe customer with full shipping and contact information
      let stripeCustomerId: string | undefined;
      try {
        const customer = await stripeClient.customers.create({
          name: `${businessName.trim()} (Attn: ${contactName.trim()})`,
          email: email.trim(),
          phone: phone.trim(),
          address: {
            line1: shippingAddress.street.trim(),
            line2: (shippingAddress.aptSuite || "").trim() || undefined,
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim().toUpperCase(),
            postal_code: shippingAddress.zip.trim(),
            country: "US",
          },
          shipping: {
            name: `${businessName.trim()} (Attn: ${contactName.trim()})`,
            phone: phone.trim(),
            address: {
              line1: shippingAddress.street.trim(),
              line2: (shippingAddress.aptSuite || "").trim() || undefined,
              city: shippingAddress.city.trim(),
              state: shippingAddress.state.trim().toUpperCase(),
              postal_code: shippingAddress.zip.trim(),
              country: "US",
            },
          },
          metadata: {
            business_name: businessName.trim(),
            contact_name: contactName.trim(),
            contact_phone: phone.trim(),
            contact_email: email.trim(),
            tax_id: (taxId || "").trim() || "N/A",
            wholesale_order_id: orderId,
            shipping_full_address: fullShippingAddressString,
            delivery_notes: (notes || "").trim().slice(0, 500) || "None",
          },
        });
        stripeCustomerId = customer.id;
        orderRecord.stripeCustomerId = stripeCustomerId;
      } catch (custError) {
        console.warn("Could not create Stripe customer record, falling back to session email:", custError);
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Jessica Farms Hot Honey — Wholesale Case (20 Jars)",
                description: `Wholesale order for ${businessName.trim()}: ${numCases} case${numCases > 1 ? "s" : ""} (${totalJars} total 5oz jars) at $6.99/jar ($139.80/case). Norton, OH.`,
                images: [`${origin}/assets/hot-honey.jpg`],
              },
              unit_amount: CASE_PRICE_CENTS,
            },
            quantity: numCases,
          },
        ],
        mode: "payment", // Full wholesale payment — no consignment, invoicing, or net terms
        ...(stripeCustomerId
          ? {
              customer: stripeCustomerId,
              customer_update: {
                name: "auto",
                address: "auto",
                shipping: "auto",
              },
            }
          : { customer_email: email.trim() }),
        phone_number_collection: {
          enabled: true,
        },
        payment_intent_data: {
          shipping: {
            name: `${businessName.trim()} (Attn: ${contactName.trim()})`,
            phone: phone.trim(),
            address: {
              line1: shippingAddress.street.trim(),
              line2: (shippingAddress.aptSuite || "").trim() || undefined,
              city: shippingAddress.city.trim(),
              state: shippingAddress.state.trim().toUpperCase(),
              postal_code: shippingAddress.zip.trim(),
              country: "US",
            },
          },
          description: `Wholesale Order: ${businessName.trim()} (${numCases} case${numCases > 1 ? "s" : ""}, ${totalJars} jars)`,
          metadata: {
            order_id: orderId,
            order_type: "wholesale",
            business_name: businessName.trim(),
            contact_name: contactName.trim(),
            contact_phone: phone.trim(),
            contact_email: email.trim(),
            tax_id: (taxId || "").trim() || "N/A",
            shipping_name: `${businessName.trim()} (Attn: ${contactName.trim()})`,
            shipping_phone: phone.trim(),
            shipping_full_address: fullShippingAddressString,
            shipping_street: shippingAddress.street.trim(),
            shipping_apt_suite: (shippingAddress.aptSuite || "").trim() || "N/A",
            shipping_city: shippingAddress.city.trim(),
            shipping_state: shippingAddress.state.trim().toUpperCase(),
            shipping_zip: shippingAddress.zip.trim(),
            shipping_country: "US",
            delivery_notes: (notes || "").trim().slice(0, 500) || "None",
            case_quantity: String(numCases),
            jar_quantity: String(totalJars),
            total_paid: `$${subtotalFormatted}`,
          },
        },
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: `Jessica Farms Wholesale Order #${orderId} - ${numCases} Case${numCases > 1 ? "s" : ""} (${totalJars} Jars)`,
            metadata: {
              wholesale_order_id: orderId,
              business_name: businessName.trim(),
              contact_name: contactName.trim(),
              shipping_address: fullShippingAddressString,
            },
            custom_fields: [
              { name: "Business Name", value: businessName.trim().slice(0, 30) },
              { name: "Contact", value: `${contactName.trim()} (${phone.trim()})`.slice(0, 30) },
            ],
            footer: "Jessica Farms Apiary • Norton, OH. Questions? Contact wholesale@jessicafarms.com",
          },
        },
        success_url: `${origin}/wholesale?success=true&session_id={CHECKOUT_SESSION_ID}&cases=${numCases}&jars=${totalJars}&business=${encodeURIComponent(businessName.trim())}`,
        cancel_url: `${origin}/wholesale?canceled=true`,
        metadata: {
          order_id: orderId,
          order_type: "wholesale",
          business_name: businessName.trim(),
          contact_name: contactName.trim(),
          contact_phone: phone.trim(),
          contact_email: email.trim(),
          tax_id: (taxId || "").trim() || "N/A",
          shipping_name: `${businessName.trim()} (Attn: ${contactName.trim()})`,
          shipping_phone: phone.trim(),
          shipping_full_address: fullShippingAddressString,
          shipping_street: shippingAddress.street.trim(),
          shipping_apt_suite: (shippingAddress.aptSuite || "").trim() || "N/A",
          shipping_city: shippingAddress.city.trim(),
          shipping_state: shippingAddress.state.trim().toUpperCase(),
          shipping_zip: shippingAddress.zip.trim(),
          shipping_country: "US",
          delivery_notes: (notes || "").trim().slice(0, 500) || "None",
          case_quantity: String(numCases),
          jar_quantity: String(totalJars),
          price_per_jar: "$6.99",
          price_per_case: "$139.80",
          total_paid: `$${subtotalFormatted}`,
        },
      });

      orderRecord.stripeSessionId = session.id;

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
