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

## Stripe Payment Integration with Elements

The payment page uses **Stripe Elements** with separate input fields for card number, expiry date, and CVC. Payments are processed using **Payment Intents** (not Checkout Sessions).

### Frontend Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your **Publishable Key** from the Stripe Dashboard
3. Add it to your `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`

### Backend Setup

A backend server (`server.js`) is included to handle Payment Intent creation.

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root with:
   ```bash
   # Stripe Secret Key (from Stripe Dashboard)
   STRIPE_SECRET_KEY=sk_test_...
   
   # Backend server port (optional, defaults to 3001)
   PORT=3001
   
   # Webhook secret (optional, for webhook handling)
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Start the backend server:**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:3001`

4. **Start the frontend (in a separate terminal):**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` and proxy `/api` requests to the backend.

### Payment Flow

1. Frontend sends amount in **cents** (e.g., 3000 cents for $30.00 NZD)
2. Backend creates a Stripe Payment Intent with the amount and currency (NZD)
3. Backend returns `clientSecret` to frontend
4. Frontend confirms payment using Stripe Elements
5. Payment is processed securely

### Important Notes

- **Amount Format**: All amounts are sent in the smallest currency unit (cents for NZD)
  - $20.00 NZD = 2000 cents
  - $30.00 NZD = 3000 cents
- **Currency**: The system uses NZD (New Zealand Dollar) by default
- **Security**: Never expose your Stripe Secret Key in frontend code. Always use it on the backend server only.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
