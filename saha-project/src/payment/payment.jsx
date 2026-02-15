import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
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
  const [cartItems, setCartItems] = useState([]);
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
        // Fetch Cart for the user
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (cartError && cartError.code !== "PGRST116") {
          console.error("Error fetching cart:", cartError);
          setSubtotal(0);
          setServiceCount(0);
          setCartItems([]);
          setLoading(false);
          return;
        }

        if (!cartData) {
          setSubtotal(0);
          setServiceCount(0);
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch all Cart_Items for this cart
        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("id, service_id, service_index, provider_id, quantity, start_time, end_time")
          .eq("cart_id", cartData.id);

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setSubtotal(0);
          setServiceCount(0);
          setCartItems([]);
          setLoading(false);
          return;
        }

        if (!cartItemsData || cartItemsData.length === 0) {
          setSubtotal(0);
          setServiceCount(0);
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch Services to get prices and names (using service_price and service_list fields)
        const serviceIds = cartItemsData.map((item) => item.service_id).filter(Boolean);
        let servicesMap = new Map();

        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from("Services")
            .select("id, name, provider, service_list, service_price, provider_id")
            .in("id", serviceIds);

          if (servicesData) {
            servicesData.forEach((s) => {
              const prices = (s.service_price || "").split(",").map((p) => parseFloat(p.trim()) || 0);
              const names = (s.service_list || "").split(",").map((n) => n.trim()).filter(Boolean);
              servicesMap.set(s.id, { 
                prices, 
                names, 
                serviceName: s.name,
                provider: s.provider,
                provider_id: s.provider_id 
              });
            });
          }
        }

        // Calculate total and transform items
        let totalPrice = 0;
        const transformedItems = cartItemsData.map((item) => {
          const serviceInfo = servicesMap.get(item.service_id) || { prices: [], names: [], serviceName: "Service", provider: "", provider_id: null };
          const idx = item.service_index ?? 0;
          const price = serviceInfo.prices[idx] || 0;
          const subServiceName = serviceInfo.names[idx] || "";
          totalPrice += price;

          // Format date/time
          let dateTimeStr = "";
          if (item.start_time) {
            const startDate = new Date(item.start_time);
            dateTimeStr = startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) + " at " + startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          }

          return {
            cart_item_id: item.id,
            service_id: item.service_id,
            service_index: item.service_index,
            provider_id: item.provider_id || serviceInfo.provider_id,
            cost: price,
            quantity: item.quantity || 1,
            start_time: item.start_time,
            end_time: item.end_time,
            // Display info
            serviceName: serviceInfo.serviceName,
            subServiceName: subServiceName,
            provider: serviceInfo.provider,
            dateTime: dateTimeStr,
          };
        });

        setSubtotal(totalPrice);
        setServiceCount(cartItemsData.length);
        setCartItems(transformedItems);
      } catch (error) {
        console.error("Unexpected error fetching cart totals:", error);
        setSubtotal(0);
        setServiceCount(0);
        setCartItems([]);
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
                    
                    {/* Cart Items List */}
                    <div className="space-y-3 mb-6">
                      {cartItems.map((item, index) => (
                        <div 
                          key={item.cart_item_id || index}
                          className="bg-[#1C1C1C] rounded-[12px] p-4 border border-[#333]"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium">
                                {item.subServiceName || item.serviceName}
                              </div>
                              <div className="text-[#A0A0A0] text-xs mt-1">
                                {item.serviceName}{item.provider ? ` - ${item.provider}` : ""}
                              </div>
                              {item.dateTime && (
                                <div className="text-[#888] text-xs mt-1">
                                  {item.dateTime}
                                </div>
                              )}
                            </div>
                            <div className="text-white text-sm font-medium">
                              ${item.cost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#353535] h-px mb-4"></div>
                    
                    <div className="space-y-3 mb-6">
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

                  <StripeElementsWrapper 
                    total={total} 
                    subtotal={subtotal}
                    user={user} 
                    cartItems={cartItems}
                  />
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

// Flow: user enters payment page → backend creates PaymentIntent + Order → returns client_secret → frontend loads Elements → user clicks Pay → confirmPayment
function StripeElementsWrapper({ total, subtotal, user, cartItems }) {
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [intentLoading, setIntentLoading] = useState(true);
  const [intentError, setIntentError] = useState(null);
  const createIntentCalled = useRef(false);

  useEffect(() => {
    // Prevent duplicate order creation (useRef survives re-renders and Strict Mode double-invoke)
    if (createIntentCalled.current) return;

    // Due to the base 10 NZD booking fee, we only create the Payment Intent when total >= 10 (i.e. total > 10 so there is at least some service amount beyond the fee).
    if (!total || total <= 10 || !cartItems || cartItems.length === 0) {
      setIntentLoading(false);
      return;
    }

    // Mark as called immediately to prevent any duplicate calls
    createIntentCalled.current = true;

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
            cartItems: cartItems,
            subtotal: subtotal,
            tax: 0,
            total: total,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create payment intent");
        }

        const { clientSecret: secret, orderId: newOrderId } = await res.json();
        if (secret) setClientSecret(secret);
        if (newOrderId) setOrderId(newOrderId);
      } catch (e) {
        setIntentError(e.message);
        // Reset flag on error so user can retry
        createIntentCalled.current = false;
      } finally {
        setIntentLoading(false);
      }
    };

    createIntent();
  }, [total, subtotal, user?.id, cartItems]);

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

  // Due to the base 10 NZD booking fee, require total > 10 to show the payment form (i.e. greater than or equal to 10 in effect).
  if (total > 0 && total <= 10) {
    return (
      <div className="py-6 text-center">
        <p className="text-[#D1D1D1] text-sm">
          Minimum payment amount is $10.01 NZD. Please add more items to your cart.
        </p>
      </div>
    );
  }

  if (!clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance }}
    >
      <CheckoutForm total={total} clientSecret={clientSecret} orderId={orderId} />
    </Elements>
  );
}

function CheckoutForm({ total, clientSecret, orderId }) {
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

      // When confirmPayment resolves without redirect (rare): clear cart and cart_items, then navigate; usually Stripe redirects and payment-success clears the cart.
      try {
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!cartError && cartData) {
          // Delete all Cart_Items for this cart
          await supabase
            .from("Cart_Item")
            .delete()
            .eq("cart_id", cartData.id);

          // Delete the Cart entry
          await supabase
            .from("Cart")
            .delete()
            .eq("id", cartData.id);
        }
      } catch (clearErr) {
        console.error("Error clearing cart:", clearErr);
      }
      navigate("/payment-success", { state: { fromPayment: true, orderId } });
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
