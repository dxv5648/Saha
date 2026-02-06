import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function OtherServices({ currentServiceId, currentCategory }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      if (!currentCategory) {
        setLoading(false);
        return;
      }

      try {
        // Fetch services from the same category, excluding current service
        const { data: servicesData, error: servicesError } = await supabase
          .from("Services")
          .select("*")
          .eq("category", currentCategory)
          .neq("id", currentServiceId)
          .limit(5)
          .order("created_at", { ascending: false });

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          setServices([]);
        } else if (servicesData && servicesData.length > 0) {
          // Fetch ratings for all services
          const servicesWithRatings = await Promise.all(
            servicesData.map(async (service) => {
              // Calculate priceRange
              let priceRange = "$50-100/hr";
              if (service.service_price) {
                const prices = service.service_price
                  .split(",")
                  .map((p) => parseFloat(p.trim()))
                  .filter((p) => !isNaN(p));
                if (prices.length > 0) {
                  const minPrice = Math.round(Math.min(...prices));
                  const maxPrice = Math.round(Math.max(...prices));
                  priceRange =
                    minPrice === maxPrice
                      ? `$${minPrice}/hr`
                      : `$${minPrice}-${maxPrice}/hr`;
                }
              }

              // Fetch reviews for rating calculation
              const { data: reviewsData, error: reviewsError } = await supabase
                .from("Review")
                .select("Stars")
                .eq("service_id", service.id);

              let rating = 0;
              let reviewsCount = 0;

              if (!reviewsError && reviewsData && reviewsData.length > 0) {
                const totalStars = reviewsData.reduce(
                  (sum, review) => sum + review.Stars,
                  0
                );
                rating = parseFloat((totalStars / reviewsData.length).toFixed(1));
                reviewsCount = reviewsData.length;
              }

              return {
                id: service.id,
                name: service.name,
                provider: service.provider,
                priceRange: priceRange,
                rating: rating,
                reviews: reviewsCount,
                image_url: service.image_url || null,
              };
            })
          );

          setServices(servicesWithRatings);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Unexpected error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentServiceId, currentCategory]);

  const handleBookNow = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-start self-stretch bg-[#161616F0] pt-7.5 pr-5.25 inter-regular rounded-[40px]">
        <span className="text-white text-lg mb-3 ml-7.75 inter-semi-bold">
          {"Other Services You Might Like"}
        </span>
        <div className="text-[#D1D1D1] text-sm ml-7.75 mb-3.25">
          Loading services...
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-start self-stretch bg-[#161616F0] pt-7.5 pr-5.25 inter-regular rounded-[40px]">
        <span className="text-white text-lg mb-3 ml-7.75 inter-semi-bold">
          {"Other Services You Might Like"}
        </span>
        <div className="text-[#D1D1D1] text-sm ml-7.75 mb-3.25">
          No other services in this category available.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start self-stretch bg-[#161616F0] pt-7.5 pr-5.25 inter-regular rounded-[40px]">
      <span className="text-white text-lg mb-3 ml-7.75 inter-semi-bold">
        {"Other Services You Might Like"}
      </span>
      <div className="flex items-start self-stretch mb-3.25 ml-5.25 gap-9.5 overflow-x-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA]"
            style={{ width: "163px", flexShrink: 0 }}
          >
            <img
              src={service.image_url || WorkImage}
              className="w-40.75 h-36.75 mb-0.75 object-fill rounded-t-[30px]"
              alt={service.name}
              onError={(e) => { e.target.onerror = null; e.target.src = WorkImage; }}
            />
            <span className="text-white text-sm mb-px ml-2">
              {service.name}
            </span>
            <span className="text-white text-xs ml-2">
              By {service.provider}
            </span>
            <div className="flex justify-center items-start self-stretch mb-1 mx-4 gap-5.5">
              <span className="text-white text-xs">
                {service.rating > 0 ? `${service.rating} (${service.reviews})` : "N/A (0)"}
              </span>
              <span className="text-white text-xs">{service.priceRange}</span>
            </div>
            <button
              className="flex flex-col items-center self-stretch bg-white text-left py-1.25 mx-4 rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleBookNow(service.id)}
            >
              <span className="text-black text-sm">{"Book Now"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
