import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function RecentServices() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch recent 2 bookings from Bookings table with order details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("Bookings")
          .select("id, service_id, start_time, end_time, status, order_id, order_item_id")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(2);

        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        if (!bookingsData || bookingsData.length === 0) {
          setRecentBookings([]);
          setLoading(false);
          return;
        }

        // Fetch Services data for details
        const serviceIds = bookingsData.map((b) => b.service_id).filter(Boolean);

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

        // Fetch order_items to get service_index and unit_price
        const orderItemIds = bookingsData.map((b) => b.order_item_id).filter(Boolean);
        let orderItemsMap = new Map();
        if (orderItemIds.length > 0) {
          const { data: orderItemsData } = await supabase
            .from("order_items")
            .select("id, service_index, unit_price")
            .in("id", orderItemIds);

          if (orderItemsData) {
            orderItemsMap = new Map(orderItemsData.map((oi) => [oi.id, oi]));
          }
        }

        // Fetch orders to get order details
        const orderIds = [...new Set(bookingsData.map((b) => b.order_id).filter(Boolean))];
        let ordersMap = new Map();
        if (orderIds.length > 0) {
          const { data: ordersData } = await supabase
            .from("Orders")
            .select("id, status, total, created_at")
            .in("id", orderIds);

          if (ordersData) {
            ordersMap = new Map(ordersData.map((o) => [o.id, o]));
          }
        }

        // Transform data
        const bookings = bookingsData.map((booking) => {
          const service = booking.service_id
            ? servicesMap.get(booking.service_id)
            : null;
          const orderItem = booking.order_item_id
            ? orderItemsMap.get(booking.order_item_id)
            : null;
          const order = booking.order_id
            ? ordersMap.get(booking.order_id)
            : null;

          // Get sub-service name from service_list using service_index
          let subServiceName = "";
          let unitPrice = orderItem?.unit_price || 0;
          if (service && orderItem?.service_index !== null && orderItem?.service_index !== undefined) {
            const names = (service.service_list || "").split(",").map((s) => s.trim()).filter(Boolean);
            if (names[orderItem.service_index]) {
              subServiceName = names[orderItem.service_index];
            }
          }

          // Format date and time
          let dateStr = "";
          let timeStr = "";
          let dateTimeStr = "";
          if (booking.start_time) {
            const startDate = new Date(booking.start_time);
            dateStr = startDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            timeStr = startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            dateTimeStr = `${dateStr} at ${timeStr}`;
          }

          // Format end time
          let endTimeStr = "";
          if (booking.end_time) {
            const endDate = new Date(booking.end_time);
            endTimeStr = endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          }

          // Format order date
          let orderDateStr = "";
          if (order?.created_at) {
            const orderDate = new Date(order.created_at);
            orderDateStr = orderDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
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
            subServiceName: subServiceName,
            provider: service ? service.provider : "Unknown",
            date: dateStr,
            time: timeStr,
            endTime: endTimeStr,
            dateTime: dateTimeStr,
            status: booking.status || "booked",
            statusColor: statusColors[booking.status] || statusColors.booked,
            image: service?.image_url || WorkImage,
            serviceId: booking.service_id,
            orderId: booking.order_id,
            orderDate: orderDateStr,
            orderStatus: order?.status || "",
            unitPrice: unitPrice,
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

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
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
                    onClick={() => handleViewDetails(booking)}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-[#1C1C1C] rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with image */}
            <div className="relative">
              <img
                src={selectedBooking.image}
                alt={selectedBooking.title}
                className="w-full h-48 object-cover rounded-t-[24px]"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedBooking.statusColor}`}
                >
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-white text-xl font-semibold mb-1">
                {selectedBooking.subServiceName || selectedBooking.title}
              </h3>
              {selectedBooking.subServiceName && (
                <p className="text-[#A0A0A0] text-sm mb-2">{selectedBooking.title}</p>
              )}
              <p className="text-[#888] text-sm mb-4">{selectedBooking.provider}</p>

              {/* Booking Info */}
              <div className="space-y-4 mb-6">
                <div className="bg-[#252525] rounded-[12px] p-4">
                  <h4 className="text-[#888] text-xs uppercase tracking-wide mb-3">Appointment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#A0A0A0] text-sm">Date</span>
                      <span className="text-white text-sm">{selectedBooking.date || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0A0A0] text-sm">Time</span>
                      <span className="text-white text-sm">
                        {selectedBooking.time}{selectedBooking.endTime ? ` - ${selectedBooking.endTime}` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0A0A0] text-sm">Price</span>
                      <span className="text-white text-sm font-medium">${selectedBooking.unitPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.orderId && (
                  <div className="bg-[#252525] rounded-[12px] p-4">
                    <h4 className="text-[#888] text-xs uppercase tracking-wide mb-3">Order Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#A0A0A0] text-sm">Order ID</span>
                        <span className="text-white text-sm">#{selectedBooking.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A0A0A0] text-sm">Order Date</span>
                        <span className="text-white text-sm">{selectedBooking.orderDate || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A0A0A0] text-sm">Payment Status</span>
                        <span className="text-green-400 text-sm capitalize">{selectedBooking.orderStatus}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/service/${selectedBooking.serviceId}`);
                  }}
                  className="flex-1 bg-white text-black py-3 rounded-[10px] font-medium hover:bg-gray-200 transition"
                >
                  View Service
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-[#333] text-white py-3 rounded-[10px] font-medium hover:bg-[#444] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
