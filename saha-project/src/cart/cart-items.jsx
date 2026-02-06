import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function CartItems() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, fetch Cart for the user
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (cartError && cartError.code !== "PGRST116") {
          console.error("Error fetching cart:", cartError);
          setCartItems([]);
          setLoading(false);
          return;
        }

        if (!cartData) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch all Cart_Items for this cart
        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("id, service_id, service_index, provider_id, quantity, start_time, end_time")
          .eq("cart_id", cartData.id)
          .order("created_at", { ascending: false });

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setCartItems([]);
          setLoading(false);
          return;
        }

        if (!cartItemsData || cartItemsData.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch Services data (with service_list and service_price for sub-service lookup)
        const serviceIds = cartItemsData.map((item) => item.service_id).filter(Boolean);
        let servicesMap = new Map();
        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from("Services")
            .select("id, name, provider, image_url, service_list, service_price")
            .in("id", serviceIds);

          if (servicesData) {
            servicesMap = new Map(servicesData.map((s) => [s.id, s]));
          }
        }

        // Transform data to match UI format
        const transformedItems = cartItemsData.map((item) => {
          const service = item.service_id ? servicesMap.get(item.service_id) : null;

          // Format date and time from start_time
          let dateTimeStr = "";
          if (item.start_time) {
            const startDate = new Date(item.start_time);
            const date = startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const time = startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            dateTimeStr = `${date}, ${time}`;
          }

          // Parse service_list and service_price to get sub-service name and price
          let subServiceName = "";
          let price = 0;
          if (service && item.service_index !== null && item.service_index !== undefined) {
            const names = (service.service_list || "").split(",").map((s) => s.trim()).filter(Boolean);
            const prices = (service.service_price || "").split(",").map((p) => p.trim()).filter(Boolean);
            
            if (names[item.service_index]) {
              subServiceName = names[item.service_index];
            }
            if (prices[item.service_index]) {
              price = parseFloat(prices[item.service_index]) || 0;
            }
          }

          // Build title: "SubService - MainService: Provider" or fallback
          let title = "Service";
          if (service) {
            if (subServiceName) {
              title = `${subServiceName} - ${service.name}: ${service.provider}`;
            } else {
              title = `${service.name}: ${service.provider}`;
            }
          }

          return {
            id: item.id,
            cartItemId: item.id,
            cartId: cartData.id,
            title: title,
            serviceList: subServiceName,
            time: dateTimeStr,
            cost: `$${price.toFixed(2)}`,
            costValue: price,
            image: service?.image_url || WorkImage,
            serviceId: item.service_id,
          };
        });
        setCartItems(transformedItems);

        // Dispatch event to refresh order summary
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } catch (error) {
        console.error("Unexpected error fetching cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleRemove = async (cartItemId) => {
    if (!confirm("Are you sure you want to remove this item from your cart?")) {
      return;
    }

    try {
      // Delete the Cart_Item entry
      const { error: cartItemError } = await supabase
        .from("Cart_Item")
        .delete()
        .eq("id", cartItemId);

      if (cartItemError) {
        console.error("Error removing cart item:", cartItemError);
        alert("Error removing item: " + cartItemError.message);
        return;
      }

      // Remove from local state
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

      // Dispatch event to refresh order summary
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Unexpected error removing cart item:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-white text-2xl inter-semi-bold mb-4">Your Cart</h2>
        <div className="text-center py-12">
          <span className="text-[#D1D1D1] text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h2 className="text-white text-2xl inter-semi-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-[#D1D1D1] text-lg">Your cart is empty</span>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 bg-[#161616F0] p-6 rounded-[10px] hover:bg-[#1C1C1C] transition inter-regular border border-solid border-[#434343]"
            >
              <img
                src={item.image}
                alt="Service"
                className="w-32 h-32 object-cover rounded-lg shrink-0"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <span className="text-white text-base font-semibold block mb-2">
                    {item.title}
                  </span>
                  {item.serviceList && (
                    <span className="text-[#D1D1D1] text-xs block mb-2">
                      Services: {item.serviceList}
                    </span>
                  )}
                  <span className="text-[#D1D1D1] text-sm block mb-3">
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">
                    {item.cost}
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-[#800000] text-sm hover:text-red-500 transition font-medium"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            className="flex items-center justify-center bg-[#161616F0] text-white text-base font-semibold py-4 rounded-[10px] hover:bg-[#1C1C1C] transition mt-4 border border-solid border-[#434343]"
            onClick={() => (window.location.href = "/service")}
          >
            + Add More Services
          </button>
        </>
      )}
    </div>
  );
}
