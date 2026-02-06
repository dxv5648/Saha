import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: STRIPE_SECRET_KEY is not set in environment variables");
  console.error("Please add STRIPE_SECRET_KEY to your .env file");
  process.exit(1);
}

// Initialize Supabase
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_KEY) {
  console.error("ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_KEY is not set");
  console.error("Please add these to your .env file");
  process.exit(1);
}

// Debug: print actual values being used
console.log("Supabase URL:", process.env.VITE_SUPABASE_URL);
console.log("Supabase Key (first 20 chars):", process.env.VITE_SUPABASE_KEY?.substring(0, 20) + "...");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

// Middleware
app.use(cors());

// Webhook endpoint needs raw body for signature verification - must be before express.json()
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      console.log(`Payment succeeded: ${paymentIntent.id}, Order: ${orderId}`);

      if (orderId) {
        // Get order details
        const { data: orderData } = await supabase
          .from("Orders")
          .select("customer_id")
          .eq("id", orderId)
          .single();

        // Update order status to 'paid'
        const { error } = await supabase
          .from("Orders")
          .update({ status: "paid" })
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order to paid:", error);
        } else {
          console.log(`Order ${orderId} marked as paid`);

          // Create Bookings from order_items
          const { data: orderItems } = await supabase
            .from("order_items")
            .select("id, service_id, provider_id, start_time, end_time")
            .eq("order_id", orderId);

          if (orderItems && orderItems.length > 0 && orderData) {
            const bookings = orderItems.map((item) => ({
              order_id: orderId,
              order_item_id: item.id,
              service_id: item.service_id,
              customer_id: orderData.customer_id,
              provider_id: item.provider_id,
              start_time: item.start_time,
              end_time: item.end_time,
              status: "booked",
              notes: null,
            }));

            const { error: bookingsError } = await supabase
              .from("Bookings")
              .insert(bookings);

            if (bookingsError) {
              console.error("Error creating bookings:", bookingsError);
            } else {
              console.log(`Created ${bookings.length} bookings for order ${orderId}`);
            }
          }
        }
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const failedPayment = event.data.object;
      const orderId = failedPayment.metadata?.orderId;
      console.log(`Payment failed: ${failedPayment.id}, Order: ${orderId}`);

      if (orderId) {
        // Update order status to 'cancelled'
        const { error } = await supabase
          .from("Orders")
          .update({ status: "cancelled" })
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order to cancelled:", error);
        } else {
          console.log(`Order ${orderId} marked as cancelled`);
        }
      }
      break;
    }
    case "payment_intent.canceled": {
      const canceledPayment = event.data.object;
      const orderId = canceledPayment.metadata?.orderId;
      console.log(`Payment canceled: ${canceledPayment.id}, Order: ${orderId}`);

      if (orderId) {
        // Update order status to 'cancelled'
        const { error } = await supabase
          .from("Orders")
          .update({ status: "cancelled" })
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order to cancelled:", error);
        } else {
          console.log(`Order ${orderId} marked as cancelled`);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Parse JSON for all other routes
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create Payment Intent endpoint (also creates order and order_items)
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, userId, cartItems, subtotal, tax, total } = req.body;

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

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required.",
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        error: "Cart items are required.",
      });
    }

    // Ensure amount is an integer (Stripe requires integer cents)
    const amountInCents = Math.round(Number(amount));

    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        error: "Invalid amount format. Amount must be a positive number in cents.",
      });
    }

    console.log(
      `Creating order and payment intent: ${amountInCents} ${currency.toUpperCase()} for user ${userId}`
    );

    // Step 1: Create the order with status 'pending'
    const { data: orderData, error: orderError } = await supabase
      .from("Orders")
      .insert({
        customer_id: userId,
        status: "pending",
        currency: currency.toUpperCase(),
        subtotal: subtotal || 0,
        tax: tax || 0,
        total: total || 0,
        notes: null,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return res.status(500).json({
        error: "Failed to create order: " + orderError.message,
      });
    }

    const orderId = orderData.id;
    console.log(`Order created: ${orderId}`);

    // Step 2: Copy cart_items to order_items (lock prices, times, etc.)
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      service_id: item.service_id || null,
      service_index: item.service_index ?? null,
      provider_id: item.provider_id || null,
      quantity: item.quantity || 1,
      unit_price: item.cost || 0,
      start_time: item.start_time || null,
      end_time: item.end_time || null,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      // Rollback: delete the order if order_items failed
      await supabase.from("Orders").delete().eq("id", orderId);
      return res.status(500).json({
        error: "Failed to create order items: " + orderItemsError.message,
      });
    }

    console.log(`Order items created: ${orderItems.length} items`);

    // Step 3: Create Payment Intent with order_id in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        userId: userId,
        orderId: orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(
      `Payment intent created: ${paymentIntent.id} (${paymentIntent.status})`
    );

    // Step 4: Update order with payment_intent_id
    const { error: updateError } = await supabase
      .from("Orders")
      .update({ payment_intent_id: paymentIntent.id })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with payment intent:", updateError);
      // Continue anyway, the order exists
    }

    // Return client secret and order ID to frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: orderId,
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

// Update order status endpoint (for when webhook is not available in local dev)
app.post("/api/update-order-status", async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;

    if (!paymentIntentId || !status) {
      return res.status(400).json({ error: "paymentIntentId and status are required" });
    }

    // Verify the payment intent status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Only allow updating to 'paid' if Stripe confirms payment succeeded
    if (status === "paid" && paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment has not succeeded" });
    }

    // Get the order by payment_intent_id
    const { data: orderData, error: orderFetchError } = await supabase
      .from("Orders")
      .select("id, customer_id")
      .eq("payment_intent_id", paymentIntentId)
      .single();

    if (orderFetchError || !orderData) {
      console.error("Error fetching order:", orderFetchError);
      return res.status(404).json({ error: "Order not found" });
    }

    const orderId = orderData.id;
    const customerId = orderData.customer_id;

    // Update order status in database
    const { error: updateError } = await supabase
      .from("Orders")
      .update({ status: status })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return res.status(500).json({ error: "Failed to update order status" });
    }

    console.log(`Order ${orderId} updated to ${status}`);

    // If payment succeeded, create Bookings from order_items
    if (status === "paid") {
      console.log(`Processing paid order ${orderId} for customer ${customerId}`);
      
      // Get all order_items for this order
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("id, service_id, provider_id, start_time, end_time")
        .eq("order_id", orderId);

      console.log("Order items query result:", { orderItems, itemsError });

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
      } else if (orderItems && orderItems.length > 0) {
        // Create Bookings for each order_item
        const bookings = orderItems.map((item) => ({
          order_id: orderId,
          order_item_id: item.id,
          service_id: item.service_id,
          customer_id: customerId,
          provider_id: item.provider_id,
          start_time: item.start_time,
          end_time: item.end_time,
          status: "booked",
          notes: null,
        }));

        console.log("Creating bookings:", bookings);

        const { error: bookingsError } = await supabase
          .from("Bookings")
          .insert(bookings);

        if (bookingsError) {
          console.error("Error creating bookings:", bookingsError);
        } else {
          console.log(`Created ${bookings.length} bookings for order ${orderId}`);
        }
      } else {
        console.log("No order items found for order:", orderId);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Payment Intent endpoint: http://localhost:${PORT}/api/create-payment-intent`);
});
