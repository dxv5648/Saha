import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching bookings for user:", user.id);
        
        // Fetch bookings for the user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("Bookings")
          .select("id, service_id, provider_id, start_time, end_time, status, created_at, customer_id")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        console.log("Bookings query result:", { bookingsData, bookingsError });

        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          setBookings([]);
          setLoading(false);
          return;
        }

        if (!bookingsData || bookingsData.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Fetch Services data for details
        const serviceIds = bookingsData.map((b) => b.service_id).filter(Boolean);
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
        const transformedBookings = bookingsData.map((booking) => {
          const service = booking.service_id
            ? servicesMap.get(booking.service_id)
            : null;

          // Format date and time
          let dateTimeStr = "";
          if (booking.start_time) {
            const startDate = new Date(booking.start_time);
            dateTimeStr = startDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            dateTimeStr += ` at ${timeStr}`;
          }

          // Status badge color
          const statusColors = {
            booked: "bg-green-500/20 text-green-400",
            completed: "bg-blue-500/20 text-blue-400",
            cancelled: "bg-red-500/20 text-red-400",
            pending: "bg-yellow-500/20 text-yellow-400",
          };

          return {
            id: booking.id,
            title: service ? service.name : "Service",
            provider: service ? service.provider : "Provider",
            dateTime: dateTimeStr,
            status: booking.status || "booked",
            statusColor: statusColors[booking.status] || statusColors.booked,
            image: service?.image_url || WorkImage,
            serviceId: booking.service_id,
          };
        });

        setBookings(transformedBookings);
      } catch (error) {
        console.error("Unexpected error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
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
          My Bookings
        </span>
        {loading ? (
          <div className="text-center py-8 w-full">
            <span className="text-[#D1D1D1] text-sm">Loading...</span>
          </div>
        ) : bookings.length > 0 ? (
          <div className="w-full space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center bg-[#1C1C1CB0] w-full rounded-[20px] border border-solid border-[#434343] overflow-hidden"
                style={{
                  gap: "clamp(12px, 2vw, 16px)",
                  padding: "clamp(12px, 2vw, 16px)",
                }}
              >
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-20 h-20 object-cover rounded-[12px] flex-shrink-0"
                />
                <div className="flex flex-col items-start grow inter-regular">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-white font-medium"
                      style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
                    >
                      {booking.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <span
                    className="text-[#A0A0A0] mb-1"
                    style={{ fontSize: "clamp(0.75rem, 1.3vw, 0.875rem)" }}
                  >
                    {booking.provider}
                  </span>
                  <span
                    className="text-[#D1D1D1] mb-3"
                    style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.8rem)" }}
                  >
                    {booking.dateTime || "Date not set"}
                  </span>
                  <button
                    className="bg-white text-black rounded-[10px] border-0 cursor-pointer hover:bg-gray-200 transition-colors font-medium"
                    style={{
                      fontSize: "clamp(0.75rem, 1.3vw, 0.85rem)",
                      padding: "clamp(6px, 1vw, 8px) clamp(14px, 2vw, 18px)",
                    }}
                    onClick={() => handleViewDetails(booking.serviceId)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 w-full">
            <span
              className="text-[#D1D1D1] inter-regular block mb-4"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
            >
              No bookings yet
            </span>
            <button
              onClick={() => navigate("/service")}
              className="bg-white text-black px-6 py-3 rounded-[10px] font-medium hover:bg-gray-200 transition"
            >
              Browse Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
