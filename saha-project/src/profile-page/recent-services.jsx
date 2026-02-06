import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function RecentServices() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch cart items (bookings) for the user
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id, cart_item_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (cartError) {
          console.error("Error fetching bookings:", cartError);
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        if (!cartData || cartData.length === 0) {
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        // Fetch cart item details
        const cartItemIds = cartData
          .map((cart) => cart.cart_item_id)
          .filter(Boolean);

        if (cartItemIds.length === 0) {
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("id, service, date, service_id")
          .in("id", cartItemIds);

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        // Fetch Services data for image_url
        const serviceIds =
          cartItemsData?.map((item) => item.service_id).filter(Boolean) || [];

        let servicesMap = new Map();
        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from("Services")
            .select("id, name, provider, image_url")
            .in("id", serviceIds);

          if (servicesData) {
            servicesMap = new Map(servicesData.map((s) => [s.id, s]));
          }
        }

        // Transform data
        const bookings = cartItemsData.map((cartItem) => {
          const service = cartItem.service_id
            ? servicesMap.get(cartItem.service_id)
            : null;
          const date = cartItem.date
            ? new Date(cartItem.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";

          return {
            id: cartItem.id,
            title: service ? service.name : cartItem.service || "Service",
            provider: service ? service.provider : "Unknown",
            date: date,
            image: service?.image_url || WorkImage,
            serviceId: cartItem.service_id,
          };
        });

        setRecentBookings(bookings);
      } catch (error) {
        console.error("Unexpected error fetching bookings:", error);
        setRecentBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
  }, [user]);

  const handleViewDetails = (serviceId) => {
    if (serviceId) {
      navigate(`/service/${serviceId}`);
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      <div
        className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full"
        style={{ padding: "clamp(20px, 3vw, 30px)" }}
      >
        <span
          className="text-white mb-5 inter-semi-bold"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          {"Recent Bookings"}
        </span>
        {loading ? (
          <div className="text-center py-8 w-full">
            <span className="text-[#D1D1D1] text-sm">Loading...</span>
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="w-full">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center bg-[#1C1C1CB0] w-full mb-4 rounded-[20px] border border-solid border-[#434343] overflow-hidden"
                style={{
                  gap: "clamp(8px, 1.5vw, 11px)",
                  padding: "clamp(8px, 1.5vw, 12px)",
                }}
              >
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-16 h-16 object-cover rounded-[10px] flex-shrink-0"
                />
                <div className="flex flex-col items-start grow inter-regular">
                  <span
                    className="text-white mb-1"
                    style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
                  >
                    {booking.title}
                  </span>
                  <span
                    className="text-[#D1D1D1] mb-2 text-xs"
                    style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)" }}
                  >
                    {booking.date}
                  </span>
                  <button
                    className="bg-[#434343] text-white rounded-[10px] border-0 cursor-pointer hover:bg-[#555] transition-colors"
                    style={{
                      fontSize: "clamp(0.7rem, 1.3vw, 0.8rem)",
                      padding:
                        "clamp(4px, 0.8vw, 6px) clamp(10px, 1.5vw, 14px)",
                    }}
                    onClick={() => handleViewDetails(booking.serviceId)}
                  >
                    {"View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span
            className="text-[#D1D1D1] text-center inter-regular w-full"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
          >
            {"No recent bookings to display"}
          </span>
        )}
      </div>
    </div>
  );
}
