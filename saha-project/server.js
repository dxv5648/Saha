import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with secret key
// Note: Ensure STRIPE_SECRET_KEY is set in your .env file
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: STRIPE_SECRET_KEY is not set in environment variables");
  console.error("Please add STRIPE_SECRET_KEY to your .env file");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

// Middleware
app.use(cors());
app.use(express.json());

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const mailTransporter = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth:
        SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : null,
    })
  : null;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create Payment Intent endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be greater than 0.",
      });
    }

    if (!currency) {
      return res.status(400).json({
        error: "Currency is required.",
      });
    }

    // Ensure amount is an integer (Stripe requires integer cents)
    const amountInCents = Math.round(Number(amount));

    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        error:
          "Invalid amount format. Amount must be a positive number in cents.",
      });
    }

    console.log(
      `Creating payment intent: ${amountInCents} ${currency.toUpperCase()} for user ${userId}`,
    );

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Amount in smallest currency unit (cents for NZD)
      currency: currency.toLowerCase(), // e.g., "nzd"
      metadata: {
        userId: userId || "unknown",
      },
      // Optional: Add automatic payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(
      `Payment intent created: ${paymentIntent.id} (${paymentIntent.status})`,
    );

    // Return client secret to frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Handle Stripe-specific errors
    if (error.type === "StripeCardError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: error.message || "Failed to create payment intent",
    });
  }
});

// Contact form email endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { subject, email, message } = req.body || {};

    if (!subject || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!mailTransporter) {
      return res.status(500).json({
        error: "Email service is not configured. Set SMTP_* env variables.",
      });
    }

    const fromAddress = SMTP_FROM || SMTP_USER;

    await mailTransporter.sendMail({
      from: fromAddress,
      to: "waihekepro@gmail.com",
      replyTo: email,
      subject: subject,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
});

// Webhook endpoint for Stripe events (optional, for handling payment confirmations)
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        // Update your database here
        break;
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Payment Intent endpoint: http://localhost:${PORT}/api/create-payment-intent`,
  );
});
