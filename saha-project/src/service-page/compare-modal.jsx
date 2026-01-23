import { useNavigate } from "react-router-dom";
import Face from "../assets/Face.jpg";

export default function CompareModal({ services = [], onClose = () => {} }) {
  const navigate = useNavigate();

  if (services.length === 0) {
    return null;
  }

  const handleBookNow = (serviceId) => {
    navigate(`/service/${serviceId}`);
    onClose();
  };

  const handleRemoveService = (serviceId, e) => {
    e.stopPropagation();
    // This would need to be handled by parent component
    // For now, we'll just close the modal if only one service remains
    if (services.length === 1) {
      onClose();
    }
  };

  // Extract hourly rate from priceRange (e.g., "$80-150/hr" -> "$80")
  const getHourlyRate = (priceRange) => {
    if (!priceRange) return "$0";
    const match = priceRange.match(/\$(\d+)/);
    return match ? `$${match[1]}` : priceRange.split("-")[0] || priceRange;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
      <div className="bg-[#1a1a1a] rounded-[30px] w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-center py-4 sm:py-6 relative">
          <div className="bg-[#2a2a2a]/80 backdrop-blur px-4 sm:px-10 py-4 sm:py-6 rounded-2xl text-center w-full max-w-[360px]">
            <h1 className="text-xl sm:text-2xl font-semibold text-white poppins-bold">
              Compare Service Providers
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#BABABA] inter-regular">
              Comparing {services.length} selected service{services.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Comparison Content */}
        <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10">
          <div className="bg-[#161616]/60 rounded-3xl p-4 sm:p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4 sm:gap-6 lg:gap-8 items-start">
              {/* Left Column - Labels */}
              <div className="hidden lg:flex flex-col text-sm text-white items-start">
                {/* Header spacer */}
                <div className="h-[250px]" />

                {/* Rating - aligned with stars */}
                <div className="h-[160px] flex items-center justify-end w-full">
                  <span className="inter-semi-bold">Rating</span>
                </div>

                {/* Divider */}
                <div className="w-[100px] h-px bg-[#434343]/20 mt-4 -translate-y-5 ml-auto" />

                {/* Hourly Rate - aligned with price */}
                <div className="h-[90px] flex items-center justify-end w-full">
                  <span className="inter-semi-bold">Hourly Rate</span>
                </div>

                {/* Divider */}
                <div className="w-[100px] h-px bg-[#434343]/20 mt-4 -translate-y-1 ml-auto" />

                {/* Availability - aligned with green button */}
                <div className="h-[180px] flex items-center justify-end w-full -mt-7">
                  <span className="inter-semi-bold">Availability</span>
                </div>

                {/* Action spacer */}
                <div className="h-[135px]" />
              </div>

              {/* Right Column - Service Cards */}
              <div className={`grid gap-4 sm:gap-6 ${
                services.length === 1 
                  ? 'grid-cols-1' 
                  : services.length === 2 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#161616] rounded-[20px] p-4 sm:p-6 relative flex flex-col"
                  >
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveService(service.id, e)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#2a2a2a] transition-colors z-10"
                  >
                    ×
                  </button>

                  {/* Profile Image */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={Face}
                        alt={service.provider}
                        className="object-cover rounded-full"
                        style={{
                          width: "clamp(100px, 12vw, 140px)",
                          height: "clamp(100px, 12vw, 140px)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Provider Name */}
                  <h3 className="text-white text-center inter-semi-bold mb-1" style={{
                    fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                  }}>
                    {service.provider}
                  </h3>

                  {/* Service Title */}
                  <p className="text-[#BABABA] text-center inter-regular mb-6" style={{
                    fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                  }}>
                    {service.name}
                  </p>

                  {/* Divider above Rating */}
                  <div className="w-full h-px bg-[#434343]/20 mb-4 -translate-y-1" />

                  {/* Rating Section - aligned with left label */}
                  <div className="h-[100px] flex items-center justify-center">
                    {/* Stars and Rating on same line */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-yellow-400"
                            style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)" }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-white inter-regular" style={{
                        fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                      }}>
                        {service.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Divider below Rating */}
                  <div className="w-full h-px bg-[#434343]/20 mt-4 translate-y" />

                  {/* Hourly Rate Section - aligned with left label */}
                  <div className="h-[140px] flex items-center justify-center">
                    <div className="text-white text-center inter-semi-bold" style={{
                      fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                    }}>
                      {getHourlyRate(service.priceRange)} /hr
                    </div>
                  </div>

                  {/* Divider above Availability */}
                  <div className="w-full h-px bg-[#434343]/20 mt-4 -translate-y-7" />

                  {/* Availability Section - aligned with left label */}
                  <div className="h-[60px] flex items-center justify-center">
                    <div className="bg-green-600 text-white rounded-[10px] px-6 py-3 inter-regular" style={{
                      fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                    }}>
                      Available Tomorrow
                    </div>
                  </div>

                  {/* Divider below Availability */}
                  <div className="w-full h-px bg-[#434343]/20 mt-4 translate-y-6" />

                  {/* Book Now Button */}
                  <div className="h-[135px] flex items-end">
                    <button
                      onClick={() => handleBookNow(service.id)}
                      className="bg-white hover:bg-gray-100 text-black text-center rounded-[15px] border-0 cursor-pointer w-full font-semibold transition-all duration-300 active:scale-95"
                      style={{
                        fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                        padding: "clamp(8px, 1.5vw, 12px)",
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
