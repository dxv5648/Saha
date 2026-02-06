import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import supabase from "../supabase-client";

export default function ServiceBook({ serviceList, servicePrice, serviceId, serviceName }) {
  // Parse service & pricing strings into a usable list
  const parsedServices = useMemo(() => {
    if (!serviceList || !servicePrice) return [];

    const names = serviceList
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const prices = servicePrice
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    return names.map((name, idx) => ({
      name,
      price: prices[idx] ? parseFloat(prices[idx]) : 0,
    }));
  }, [serviceList, servicePrice]);

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();

  // Keep selection in sync when services change
  useEffect(() => {
    if (parsedServices.length === 0) {
      setSelectedIndexes([]);
    } else {
      // Default select all services
      setSelectedIndexes(parsedServices.map((_, idx) => idx));
    }
  }, [parsedServices]);

  // Check if service is already favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !serviceId) {
        setIsFavorited(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("Favorite")
          .select("id")
          .eq("service_id", serviceId)
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is fine
          console.error("Error checking favorite status:", error);
          setIsFavorited(false);
        } else {
          setIsFavorited(!!data);
        }
      } catch (error) {
        console.error("Unexpected error checking favorite status:", error);
        setIsFavorited(false);
      }
    };

    checkFavoriteStatus();
  }, [user, serviceId]);

  const toggleService = (idx) => {
    setSelectedIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx],
    );
  };

  const selectedServices = selectedIndexes
    .sort((a, b) => a - b)
    .map((idx) => parsedServices[idx])
    .filter(Boolean);

  // Generate time slots (8:00 AM to 8:00 PM, 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const time12 = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
        slots.push({ value: time24, label: time12 });
      }
    }
    return slots;
  }, []);

  const handleBook = async () => {
    // Validation
    if (!user) {
      alert("Please login to book a service");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!selectedTime) {
      alert("Please select a time");
      return;
    }

    if (!serviceId) {
      alert("Service ID is missing. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create service_list string from selected services
      const serviceListString = selectedServices.map(s => s.name).join(", ");

      // Calculate total cost of selected services
      const totalCost = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);

      // Insert cart item into database
      const { data, error } = await supabase
        .from("Cart_Item")
        .insert([
          {
            service: serviceName || serviceId,
            service_list: serviceListString,
            date: selectedDate,
            time: selectedTime,
            user_id: user.id,
            cost: totalCost,
            service_id: serviceId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding to cart: " + error.message);
        setIsSubmitting(false);
        return;
      }

      // Create Cart entry with foreign key to Cart_Item
      const { error: cartError } = await supabase
        .from("Cart")
        .insert([
          {
            cart_item_id: data.id,
            user_id: user.id,
          },
        ]);

      if (cartError) {
        console.error("Error creating cart entry:", cartError);
        alert("Error creating cart entry: " + cartError.message);
        setIsSubmitting(false);
        return;
      }

      alert("Service added to cart successfully!");
      
      // Dispatch event to refresh cart and order summary
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAddToFavorites = async () => {
    // Validation
    if (!user) {
      alert("Please login to add services to favorites");
      return;
    }

    if (!serviceId) {
      alert("Service ID is missing. Please refresh the page and try again.");
      return;
    }

    setIsAddingToFavorites(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from("Favorite")
          .delete()
          .eq("service_id", serviceId)
          .eq("user_id", user.id);

        if (deleteError) {
          console.error("Error removing from favorites:", deleteError);
          alert("Error removing from favorites: " + deleteError.message);
        } else {
          setIsFavorited(false);
          alert("Service removed from favorites");
        }
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from("Favorite")
          .insert([
            {
              service_id: serviceId,
              user_id: user.id,
            },
          ]);

        if (insertError) {
          console.error("Error adding to favorites:", insertError);
          alert("Error adding to favorites: " + insertError.message);
        } else {
          setIsFavorited(true);
          alert("Service added to favorites successfully!");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div className="flex flex-col items-start w-full bg-[#161616F0] py-6 px-6 rounded-[40px] inter-regular">
      <span className="text-white text-lg mb-6 inter-semi-bold">
        {"Book This Service"}
      </span>

      <div className="w-full mb-4">
        <span className="text-white text-sm mb-2 block">
          {"Service & Pricing"}
        </span>
        {parsedServices.length > 0 ? (
          <div className="flex flex-col gap-3 bg-[#1C1C1CB0] py-3 px-3 mb-2 rounded-[10px] border border-solid border-[#434343] w-full">
            {parsedServices.map((service, idx) => (
              <label
                key={idx}
                className="flex items-center justify-between gap-3 text-[#D1D1D1] text-sm cursor-pointer bg-[#1F1F1F] px-3 py-2 rounded-[8px] hover:bg-[#262626] transition-colors border border-transparent hover:border-[#434343]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedIndexes.includes(idx)}
                    onChange={() => toggleService(idx)}
                    className="w-4 h-4 cursor-pointer appearance-none border border-[#707070] rounded-[4px] bg-[#0F0F0F] checked:bg-white checked:border-white transition-colors"
                  />
                  <span>{service.name}</span>
                </div>
                <span>${service.price ? service.price.toFixed(2) : "0.00"}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start bg-[#1C1C1CB0] py-3 px-3 rounded-[10px] border border-solid border-[#434343] w-full">
            <span className="text-[#D1D1D1] text-sm">
              {"Service pricing not available."}
            </span>
          </div>
        )}
        {selectedServices.length > 0 && (
          <div className="text-[#D1D1D1] text-sm">
            Selected:{" "}
            {selectedServices
              .map(
                (s) => `${s.name} ($${s.price ? s.price.toFixed(2) : "0.00"})`,
              )
              .join(", ")}
          </div>
        )}
      </div>

      <div className="w-full">
        <span className="text-white text-sm mb-2 block">{"Select Date"}</span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 px-2 mb-4 rounded-[10px] border border-solid border-[#434343] focus:outline-none focus:border-white cursor-pointer"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="w-full">
        <span className="text-white text-sm mb-2 block">{"Select Time"}</span>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 px-2 mb-4 rounded-[10px] border border-solid border-[#434343] focus:outline-none focus:border-white cursor-pointer"
        >
          <option value="">Choose time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value} className="bg-[#1C1C1CB0] text-[#D1D1D1]">
              {slot.label}
            </option>
          ))}
        </select>
      </div>
      <button
        className="w-full bg-white text-black text-sm py-3 mb-3 rounded-[10px] border-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleBook}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Book"}
      </button>
      <button
        className={`w-full text-sm py-3 mb-4 rounded-[10px] border border-solid transition disabled:opacity-50 disabled:cursor-not-allowed ${
          isFavorited
            ? "bg-white text-black border-white hover:bg-gray-100"
            : "bg-[#1C1C1CB0] text-[#D1D1D1] border-[#434343] hover:bg-[#2C2C2C]"
        }`}
        onClick={handleAddToFavorites}
        disabled={isAddingToFavorites}
      >
        {isAddingToFavorites
          ? isFavorited
            ? "Removing..."
            : "Adding..."
          : isFavorited
            ? "Remove from Favorites"
            : "Add to Favorites"}
      </button>
      <div className="w-full bg-[#353535] h-px mb-4"></div>
      <div className="flex justify-between w-full text-[#D1D1D1] text-sm">
        <span>{"Response time"}</span>
        <span>{"Within 1 hour"}</span>
      </div>
    </div>
  );
}
