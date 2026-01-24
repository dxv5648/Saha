import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function Payment() {
  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const BOOKING_FEE = 10;

  useEffect(() => {
    const fetchCartTotals = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id, cart_item_id")
          .eq("user_id", user.id);

        if (cartError) {
          console.error("Error fetching cart:", cartError);
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        if (!cartData || cartData.length === 0) {
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        const cartItemIds = cartData.map((cart) => cart.cart_item_id).filter(Boolean);

        if (cartItemIds.length === 0) {
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("cost")
          .in("id", cartItemIds);

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setSubtotal(0);
          setServiceCount(0);
        } else if (cartItemsData) {
          const total = cartItemsData.reduce((sum, item) => sum + (item.cost || 0), 0);
          setSubtotal(total);
          setServiceCount(cartItemsData.length);
        }
      } catch (error) {
        console.error("Unexpected error fetching cart totals:", error);
        setSubtotal(0);
        setServiceCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartTotals();
  }, [user]);

  useEffect(() => {
    setTotal(subtotal + BOOKING_FEE);
  }, [subtotal]);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="relative">
        <Background />
        <div className="relative inset-0 z-10 flex flex-col">
          <div className="flex flex-col items-center px-4 py-8 pb-16">
            <div className="w-full max-w-2xl">
              <h1 className="text-white text-4xl inter-semi-bold mb-2 text-center">
                Payment
              </h1>
              <p className="text-[#D1D1D1] text-base mb-8 text-center">
                Complete your booking payment
              </p>

              {loading ? (
                <div className="text-center py-12">
                  <span className="text-[#D1D1D1] text-lg">Loading...</span>
                </div>
              ) : serviceCount === 0 ? (
                <div className="bg-[#161616F0] p-8 rounded-[20px] text-center">
                  <span className="text-[#D1D1D1] text-lg">
                    Your cart is empty. Please add items to your cart first.
                  </span>
                  <button
                    className="mt-6 bg-white text-black text-base py-3 px-6 rounded-[10px] hover:bg-gray-100 transition font-medium"
                    onClick={() => (window.location.href = "/service")}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="bg-[#161616F0] p-8 rounded-[20px]">
                  <div className="mb-8">
                    <h2 className="text-white text-2xl inter-semi-bold mb-6">
                      Order Summary
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[#D1D1D1] text-sm">
                          Subtotal ({serviceCount}{" "}
                          {serviceCount === 1 ? "Service" : "Services"})
                        </span>
                        <span className="text-white text-sm">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#D1D1D1] text-sm">Booking Fee</span>
                        <span className="text-white text-sm">
                          ${BOOKING_FEE.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#353535] h-px mb-6"></div>
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-white text-lg">Total</span>
                      <span className="text-white text-2xl">${total.toFixed(2)} NZD</span>
                    </div>
                  </div>

                  <StripeElementsWrapper total={total} user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initialize Stripe — locale "en" so card labels (Card number, Expiration date, etc.) show in English
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  locale: "en",
});

const appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#1a1a1a",
    colorText: "#ffffff",
    colorDanger: "#ef4444",
    fontFamily: "system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "10px",
  },
};

// Stripe Elements wrapper: create PaymentIntent first, then render Payment Element
function StripeElementsWrapper({ total, user }) {
  const [clientSecret, setClientSecret] = useState("");
  const [intentLoading, setIntentLoading] = useState(true);
  const [intentError, setIntentError] = useState(null);

  useEffect(() => {
    if (!total || total <= 0) {
      setIntentLoading(false);
      return;
    }

    let cancelled = false;
    setIntentLoading(true);
    setIntentError(null);

    const createIntent = async () => {
      try {
        const amountInCents = Math.round(total * 100);
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInCents,
            currency: "nzd",
            userId: user?.id,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create payment intent");
        }

        const { clientSecret: secret } = await res.json();
        if (!cancelled && secret) setClientSecret(secret);
      } catch (e) {
        if (!cancelled) setIntentError(e.message);
      } finally {
        if (!cancelled) setIntentLoading(false);
      }
    };

    createIntent();
    return () => { cancelled = true; };
  }, [total, user?.id]);

  if (intentLoading) {
    return (
      <div className="py-6 text-center">
        <span className="text-[#D1D1D1]">Loading payment form...</span>
      </div>
    );
  }

  if (intentError) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-[10px] text-sm">
        {intentError}
      </div>
    );
  }

  if (!clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance, locale: "en" }}
    >
      <CheckoutForm total={total} clientSecret={clientSecret} />
    </Elements>
  );
}

function CheckoutForm({ total, clientSecret }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please login to proceed with payment");
      return;
    }

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      // confirmPayment resolved without redirect (e.g. card without 3DS) — clear cart and go to success
      try {
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id")
          .eq("user_id", user.id);

        if (!cartError && cartData && cartData.length > 0) {
          const cartIds = cartData.map((c) => c.id);
          await supabase.from("Cart").delete().in("id", cartIds);
        }
      } catch (clearErr) {
        console.error("Error clearing cart:", clearErr);
      }
      navigate("/payment-success");
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Unable to process payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1a1a1a] border border-[#434343] rounded-[10px] p-5">
        <PaymentElement options={{ layout: "accordion" }} />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-[10px] text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full bg-white text-black text-base py-4 rounded-[10px] hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {processing ? "Processing..." : `Pay $${total.toFixed(2)} NZD`}
      </button>

      <button
        type="button"
        onClick={() => navigate("/Cart")}
        className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
      >
        Back to Cart
      </button>
    </form>
  );
}
