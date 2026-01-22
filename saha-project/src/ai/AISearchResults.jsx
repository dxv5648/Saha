import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";

/**
 * Component to display AI search results
 */
export default function AISearchResults({ results, onClose, inline = false }) {
  const navigate = useNavigate();

  if (!results || results.services.length === 0) {
    const containerClass = inline
      ? "bg-[#121212F0] rounded-[20px] p-6 w-full overflow-y-auto"
      : "fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70";
    const innerClass = inline
      ? ""
      : "bg-[#121212F0] rounded-[20px] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto";

    return (
      <div className={containerClass}>
        <div className={innerClass}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-bold">Search Results</h2>
            {!inline && (
              <button
                onClick={onClose}
                className="text-white text-2xl hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[#BABABA]">No services found matching your query. Try different keywords.</p>
          {results?.reasoning && (
            <p className="text-[#BABABA] mt-2 text-sm italic">{results.reasoning}</p>
          )}
        </div>
      </div>
    );
  }

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    onClose();
  };

  const handleCompareClick = () => {
    const serviceIds = results.services.map((s) => s.id).join(",");
    navigate(`/Service?compare=${serviceIds}`);
    onClose();
  };

  const containerClass = inline
    ? "bg-[#121212F0] rounded-[20px] p-6 w-full overflow-y-auto"
    : "fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70";
  const innerClass = inline
    ? ""
    : "bg-[#121212F0] rounded-[20px] p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Search Results</h2>
            {results.reasoning && (
              <p className="text-[#BABABA] text-sm mt-1">{results.reasoning}</p>
            )}
          </div>
          {!inline && (
            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        {results.type === "comparison" && results.services.length > 1 && (
          <button
            onClick={handleCompareClick}
            className="mb-4 w-full bg-[#014A86] hover:bg-[#015a9f] text-white py-2 px-4 rounded-[10px] font-semibold"
          >
            Compare All Services
          </button>
        )}

        <div className="space-y-4">
          {results.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => handleServiceClick(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick }) {
  // Calculate price range
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

  return (
    <div
      onClick={onClick}
      className="bg-[#0F0F0F] border border-[#BABABA] rounded-[10px] p-4 cursor-pointer hover:border-white/70 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-1">
            {service.name}
          </h3>
          <p className="text-[#BABABA] text-sm mb-2">
            Provider: {service.provider}
          </p>
          <p className="text-[#BABABA] text-sm mb-2">
            Category: {service.category}
          </p>
          {service.description && (
            <p className="text-[#BABABA] text-sm mb-2 line-clamp-2">
              {service.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[#BABABA] text-sm">
              ⭐ {service.rating || 4.5} ({service.reviews || 100} reviews)
            </span>
            <span className="text-[#014A86] text-sm font-semibold">
              {priceRange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

