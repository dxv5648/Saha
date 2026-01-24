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
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
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
                      <span className="text-white text-2xl">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <StripeElementsWrapper total={total} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe Elements wrapper component
function StripeElementsWrapper({ total }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#ffffff",
            colorBackground: "#161616",
            colorText: "#ffffff",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "10px",
          },
        },
      }}
    >
      <CheckoutForm total={total} />
    </Elements>
  );
}

function CheckoutForm({ total }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardError, setCardError] = useState(null);

  // Convert NZD amount to cents (smallest currency unit)
  // For NZD: 1 NZD = 100 cents
  // So 20.00 NZD = 2000 cents, 30.00 NZD = 3000 cents
  const amountInCents = Math.round(total * 100);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please login to proceed with payment");
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);
    setCardError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError("Card elements not loaded. Please refresh the page.");
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Create Payment Intent on backend
      // Uses Vite proxy in development, or VITE_API_URL in production
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents, // Amount in cents (e.g., 2000 for 20.00 NZD)
          currency: "nzd", // New Zealand Dollar
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to create payment intent"
        );
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("No client secret returned from server");
      }

      // Step 2: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              // You can add user details here if available
            },
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful - clear cart and redirect
        try {
          // Fetch cart items to clear
          const { data: cartData, error: cartError } = await supabase
            .from("Cart")
            .select("id")
            .eq("user_id", user.id);

          if (cartError) {
            console.error("Error fetching cart:", cartError);
          }

          // Clear cart after successful payment
          if (cartData && cartData.length > 0) {
            const cartIds = cartData.map((cart) => cart.id);
            const { error: deleteError } = await supabase
              .from("Cart")
              .delete()
              .in("id", cartIds);

            if (deleteError) {
              console.error("Error clearing cart:", deleteError);
            }
          }

          // Redirect to success page
          navigate("/payment-success");
        } catch (clearErr) {
          console.error("Error clearing cart:", clearErr);
          // Still redirect to success page even if cart clearing fails
          navigate("/payment-success");
        }
      } else {
        // Payment failed - keep cart items and show error
        setError("Payment was not completed. Please try again.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message ||
          "Unable to process payment. Please ensure the backend API is configured."
      );
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        "::placeholder": {
          color: "#9ca3af",
        },
        fontFamily: "system-ui, sans-serif",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-[#D1D1D1] text-sm mb-2">
            Card Number
          </label>
          <div className="bg-[#1C1C1C] border border-[#434343] rounded-[10px] p-4">
            <CardNumberElement options={cardElementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#D1D1D1] text-sm mb-2">
              Expiry Date
            </label>
            <div className="bg-[#1C1C1C] border border-[#434343] rounded-[10px] p-4">
              <CardExpiryElement options={cardElementOptions} />
            </div>
          </div>

          <div>
            <label className="block text-[#D1D1D1] text-sm mb-2">CVC</label>
            <div className="bg-[#1C1C1C] border border-[#434343] rounded-[10px] p-4">
              <CardCvcElement options={cardElementOptions} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-[10px] text-sm">
          {error}
        </div>
      )}

      {cardError && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-[10px] text-sm">
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe}
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
