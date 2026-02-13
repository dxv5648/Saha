import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";

export default function OrderSummary() {
  const [subtotal, setSubtotal] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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
          setLoading(false);
          return;
        }

        if (!cartData) {
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        // Fetch all Cart_Items for this cart
        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("id, service_id, service_index")
          .eq("cart_id", cartData.id);

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        if (!cartItemsData || cartItemsData.length === 0) {
          setSubtotal(0);
          setServiceCount(0);
          setLoading(false);
          return;
        }

        // Fetch Services to get prices (using service_price field)
        const serviceIds = cartItemsData.map((item) => item.service_id).filter(Boolean);
        let totalPrice = 0;

        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from("Services")
            .select("id, service_price")
            .in("id", serviceIds);

          if (servicesData) {
            // Create a map of service_id -> array of prices
            const priceMap = new Map();
            servicesData.forEach((s) => {
              const prices = (s.service_price || "").split(",").map((p) => parseFloat(p.trim()) || 0);
              priceMap.set(s.id, prices);
            });

            totalPrice = cartItemsData.reduce((sum, item) => {
              const prices = priceMap.get(item.service_id) || [];
              const idx = item.service_index ?? 0;
              const price = prices[idx] || 0;
              return sum + price;
            }, 0);
          }
        }

        setSubtotal(totalPrice);
        setServiceCount(cartItemsData.length);
      } catch (error) {
        console.error("Unexpected error fetching cart totals:", error);
        setSubtotal(0);
        setServiceCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartTotals();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartTotals();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const total = subtotal + BOOKING_FEE;

  return (
    <div className="w-96 flex flex-col bg-[#161616F0] p-8 rounded-[20px] h-fit sticky top-8 inter-regular">
      <span className="text-white text-2xl inter-semi-bold mb-8">
        Order Summary
      </span>

      {loading ? (
        <div className="text-center py-8">
          <span className="text-[#D1D1D1] text-sm">Loading...</span>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-[#D1D1D1] text-sm">
                Subtotal ({serviceCount} {serviceCount === 1 ? "Service" : "Services"})
              </span>
              <span className="text-white text-sm">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D1D1D1] text-sm">Booking Fee</span>
              <span className="text-white text-sm">${BOOKING_FEE.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#353535] h-px mb-6"></div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-white text-lg">Total</span>
            <span className="text-white text-2xl">${total.toFixed(2)}</span>
          </div>

          <button
            className="w-full bg-white text-black text-base py-4 rounded-[10px] hover:bg-gray-100 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={() => navigate("/payment")}
            disabled={serviceCount === 0}
          >
            Proceed to Payment
          </button>

          <button
            className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
            onClick={() => (window.location.href = "/service")}
          >
            Continue Shopping
          </button>
        </>
      )}
    </div>
  );
}
