# Supabase Auth (Popup Login)

This project uses Supabase Auth in a popup modal opened from the header **Login** button.

## Setup

1. Create a Supabase project
2. In the Supabase dashboard, go to **Project Settings → API**
3. Add these env vars (Vite requires the `VITE_` prefix):

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_KEY=your-anon-public-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

4. Enable **Google** provider under **Authentication → Providers**:
   - Toggle "Enable Sign in with Google" to ON
   - Add your **Client ID** (from Google Cloud Console)
   - Add your **Client Secret** (from Google Cloud Console)
5. Add your local URL to allowed redirect URLs (typically `http://localhost:5173`)

## Stripe Payment Integration

The payment page is integrated with Stripe Checkout. To enable payments:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your **Publishable Key** from the Stripe Dashboard
3. Add it to your `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`
4. Create a backend endpoint at `/api/create-checkout-session` that:
   - Creates a Stripe Checkout Session
   - Returns the `sessionId` to the frontend
   - Handles payment success/cancel callbacks

Example backend endpoint (Node.js/Express):
```javascript
app.post('/api/create-checkout-session', async (req, res) => {
  const { amount, currency, userId, successUrl, cancelUrl } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: currency || 'usd',
        product_data: {
          name: 'Service Booking',
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: userId,
    },
  });
  
  res.json({ sessionId: session.id });
});
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
