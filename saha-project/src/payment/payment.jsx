import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";

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
                      <span className="text-white text-2xl">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <CheckoutForm total={total} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ total }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to proceed with payment");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create Stripe Checkout Session
      // You need to create a backend endpoint that creates a Stripe Checkout Session
      // Example endpoint: POST /api/create-checkout-session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents
          currency: "usd",
          userId: user.id,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await import("@stripe/stripe-js").then(
        (mod) => mod.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      );

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.message ||
          "Unable to process payment. Please ensure the backend API is configured."
      );
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-[10px] text-sm">
        <p className="font-semibold mb-2">Setup Instructions:</p>
        <p className="text-xs">
          To enable payments, create a backend endpoint at{" "}
          <code className="bg-black/30 px-1 rounded">/api/create-checkout-session</code>{" "}
          that creates a Stripe Checkout Session. See Stripe documentation for details.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-[10px] text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={processing}
        className="w-full bg-white text-black text-base py-4 rounded-[10px] hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>

      <button
        type="button"
        onClick={() => navigate("/Cart")}
        className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
      >
        Back to Cart
      </button>
    </div>
  );
}
