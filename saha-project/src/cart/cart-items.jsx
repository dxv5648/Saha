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
        // First, fetch Cart items for the user
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id, cart_item_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (cartError) {
          console.error("Error fetching cart:", cartError);
          setCartItems([]);
          return;
        }

        if (!cartData || cartData.length === 0) {
          setCartItems([]);
          return;
        }

        // Fetch all Cart_Item details
        const cartItemIds = cartData.map((cart) => cart.cart_item_id).filter(Boolean);
        
        // If no cart item IDs, set empty cart
        if (cartItemIds.length === 0) {
          setCartItems([]);
          return;
        }

        // Fetch Cart_Item details without Services join first
        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("Cart_Item")
          .select("id, service, service_list, date, time, cost, service_id")
          .in("id", cartItemIds);

        if (cartItemsError) {
          console.error("Error fetching cart items:", cartItemsError);
          setCartItems([]);
          return;
        }

        // Fetch Services separately if we have service_ids
        const serviceIds = cartItemsData
          ?.map(item => item.service_id)
          .filter(Boolean) || [];
        
        let servicesMap = new Map();
        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from("Services")
            .select("id, name, provider, image")
            .in("id", serviceIds);
          
          if (servicesData) {
            servicesMap = new Map(servicesData.map(s => [s.id, s]));
          }
        }

        // Create a map of cart_item_id -> cart_item data with Services merged
        const cartItemMap = new Map();
        if (cartItemsData) {
          cartItemsData.forEach((item) => {
            cartItemMap.set(item.id, {
              ...item,
              Services: item.service_id ? servicesMap.get(item.service_id) : null
            });
          });
        }

        // Transform data to match UI format
        const transformedItems = cartData
          .filter((cart) => cartItemMap.has(cart.cart_item_id))
          .map((cart) => {
            const cartItem = cartItemMap.get(cart.cart_item_id);
            const service = cartItem?.Services;
              
              // Format date and time
              const date = cartItem.date
                ? new Date(cartItem.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: cartItem.date.split("-")[0] !== new Date().getFullYear().toString() ? "numeric" : undefined,
                  })
                : "";
              
              // Format time (convert 24h to 12h)
              let timeFormatted = "";
              if (cartItem.time) {
                const [hours, minutes] = cartItem.time.split(":");
                const hour24 = parseInt(hours);
                const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                const ampm = hour24 >= 12 ? "PM" : "AM";
                timeFormatted = `${hour12}:${minutes} ${ampm}`;
              }

              return {
                id: cart.id,
                cartItemId: cartItem.id,
                title: service
                  ? `${service.name}: ${service.provider}`
                  : cartItem.service || "Service",
                serviceList: cartItem.service_list || "",
                time: date && timeFormatted ? `${date}, ${timeFormatted}` : date || timeFormatted || "",
                cost: `$${cartItem.cost ? cartItem.cost.toFixed(2) : "0.00"}`,
                image: service?.image || WorkImage,
                serviceId: cartItem.service_id,
                date: cartItem.date,
                timeValue: cartItem.time,
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

  const handleRemove = async (cartId) => {
    if (!confirm("Are you sure you want to remove this item from your cart?")) {
      return;
    }

    try {
      // Find the cart item to get the cartItemId
      const cartItem = cartItems.find((item) => item.id === cartId);
      const cartItemId = cartItem?.cartItemId;

      // Delete the Cart entry
      const { error: cartError } = await supabase
        .from("Cart")
        .delete()
        .eq("id", cartId);

      if (cartError) {
        console.error("Error removing cart entry:", cartError);
        alert("Error removing item: " + cartError.message);
        return;
      }

      // Delete the corresponding Cart_Item entry
      if (cartItemId) {
        const { error: cartItemError } = await supabase
          .from("Cart_Item")
          .delete()
          .eq("id", cartItemId);

        if (cartItemError) {
          console.error("Error removing cart item entry:", cartItemError);
          alert("Error removing cart item: " + cartItemError.message);
          return;
        }
      }

      // Remove from local state
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      
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
              className="flex gap-6 bg-[#161616F0] p-6 rounded-[20px] hover:bg-[#1C1C1C] transition inter-regular"
            >
              <img
                src={item.image}
                alt={item.title}
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
                      className="bg-[#1C1C1CB0] text-[#D1D1D1] text-xs py-2 px-4 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
                      onClick={() => alert("Edit time")}
                    >
                      Edit Time
                    </button>
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
            className="flex items-center justify-center bg-[#161616F0] text-white text-base font-semibold py-4 rounded-[20px] hover:bg-[#1C1C1C] transition mt-4"
            onClick={() => (window.location.href = "/service")}
          >
            + Add More Services
          </button>
        </>
      )}
    </div>
  );
}
