<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/2

## Assets Reference

### Global Assets
- `/assets/logo.png` - Jessica Farms Logo (Header, Footer, Contact)
- `https://picsum.photos/seed/jessicafarms-logo/200/200` - Header Logo Placeholder
- `https://picsum.photos/seed/jessicafarms-footer/200/200` - Footer Logo Placeholder

### Farm Page (Home)
- `/assets/farm-hero.jpg` - Main hero background
- `/assets/honey-icon.png` - Norton Apiary section icon
- `/assets/apiary.jpg` - Norton Apiary section image
- `/assets/koi-icon.png` - Ornamental Koi section icon
- `/assets/koi-pond.jpg` - Ornamental Koi section image

### Market Stand (Shop)
- `/assets/honey-jar.jpg` - Hametown Honey product image
- `/assets/hot-honey.jpg` - Habanero Hot Honey product image
- `/assets/koi-small.jpg` - Premium Select Koi (4-6") product image
- `/assets/koi-medium.jpg` - Premium Select Koi (6-8") product image
- `/assets/koi-large.jpg` - Premium Select Koi (8-10") product image
- `/assets/cat-grass.jpg` - Cat Grass Seeds product image
- `/assets/succulents.jpg` - Succulents product image
- `/assets/sticker.jpg` - Jessica Farms Sticker product image
- `/assets/magnet.jpg` - Farm Logo Magnet product image
- `/assets/hat.jpg` - Jessica Farms Hat product image

### Checkout & Success
- `/assets/secure-lock.png` - Security badge
- `/assets/secure-shield.png` - Security badge
- `/assets/secure-check.png` - Security badge
- `/assets/tractor.png` - Harvest Complete success image

### Inquiry Modal
- `/assets/pigeon.png` - Carrier pigeon icon
- `/assets/storm.png` - Storm/Error icon
- `/assets/koi-icon.png` - Koi inquiry icon

### Contact Page
- `/assets/phone-icon.png` - Phone contact icon
- `/assets/location-icon.png` - Location address icon
- `/assets/honey-icon.png` - Honey icon in footer/contact
- `/assets/wheat-icon.png` - Wheat icon in contact
- `/assets/envelope.png` - Email icon

### Games (Bee Blaster)
- `/assets/butterbean.png` - Butterbean character reference (used as fallback/asset reference)
- Emojis used for game entities: 🐝 (Bee), 🌸🌻🌼 (Flowers), 📍 (Stingers)

## Stripe Payments Integration

To enable real payments for the Market Stand, follow these steps to integrate Stripe:

### 1. Stripe Account Setup
1. Create a free account at [Stripe.com](https://stripe.com).
2. Navigate to the **Developers** section and then **API keys**.
3. Copy your **Publishable key** and **Secret key**. Use the "Test Mode" keys for development.

### 2. Environment Variables
Add your keys to the project environment (via the Settings menu in AI Studio or a `.env` file):
```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Backend Implementation (server.ts)
1. Install the Stripe SDK: `npm install stripe`
2. Add the checkout session route to your `server.ts`:
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post("/api/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.priceNumber * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
  });

  res.json({ url: session.url });
});
```

### 4. Frontend Handling
The `Checkout.tsx` component is already configured to call this endpoint. When the user clicks "Proceed to Stripe", they will be redirected to a secure, Stripe-hosted checkout page.

### 5. Webhooks (Production Only)
For production, set up a Stripe Webhook to listen for the `checkout.session.completed` event. This ensures you can fulfill orders even if the user closes their browser before returning to your site.

---

## Market Stand Configuration

You can toggle the visibility and functionality of the Market Stand (Shop) using a feature flag. This is useful for seasonal closures or maintenance.

### Toggle the Shop Page

Add the following environment variable to your project (via the Settings menu in AI Studio or a `.env` file):

```env
VITE_ENABLE_STORE=true
```

- **`true` (Default)**: The Shop is fully active. Navigation links are visible, and users can add items to their cart.
- **`false`**: The Shop is in "Coming Soon" mode. Navigation links are hidden from the header/footer, and direct access to the shop page displays a "Coming Soon" message with an inquiry button.

If the variable is missing, the store defaults to **enabled**.

---

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
