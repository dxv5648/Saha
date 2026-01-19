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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#1a1a1a] rounded-[30px] w-full max-w-7xl max-h-[90vh] overflow-auto m-4">
        {/* Header */}
        <div className="bg-[#2a2a2a] rounded-t-[30px] px-8 py-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-white text-3xl poppins-bold mb-2">
                Compare Service Providers
              </h2>
              <p className="text-white text-sm inter-regular opacity-80">
                Comparing {services.length} selected service{services.length > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="p-8">
          <div className="flex gap-8">
            {/* Left Column - Labels */}
            <div className="flex flex-col gap-8 pt-24 min-w-[140px]">
              <div className="text-white inter-semi-bold" style={{
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              }}>Rating</div>
              <div className="text-white inter-semi-bold" style={{
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              }}>Hourly Rate</div>
              <div className="text-white inter-semi-bold" style={{
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              }}>Availability</div>
            </div>

            {/* Right Column - Service Cards */}
            <div className="flex gap-6 flex-1 overflow-x-auto pb-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-full max-w-[280px] bg-[#161616] rounded-[20px] p-6 relative flex flex-col"
                >
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveService(service.id, e)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#2a2a2a] transition-colors z-10"
                  >
                    ×
                  </button>

                  {/* Profile Image */}
                  <div className="flex justify-center mb-4 mt-2">
                    <div className="relative">
                      <img
                        src={Face}
                        alt={service.provider}
                        className="object-cover rounded-full border-2 border-[#2a2a2a]"
                        style={{
                          width: "clamp(90px, 12vw, 130px)",
                          height: "clamp(90px, 12vw, 130px)",
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

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-400"
                          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
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

                  {/* Hourly Rate */}
                  <div className="text-white text-center inter-semi-bold mb-5" style={{
                    fontSize: "clamp(1rem, 2vw, 1.125rem)",
                  }}>
                    {getHourlyRate(service.priceRange)} /hr
                  </div>

                  {/* Availability */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-600 text-white rounded-[10px] px-4 py-2 inter-regular" style={{
                      fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                    }}>
                      Available Tomorrow
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => handleBookNow(service.id)}
                    className="bg-white hover:bg-gray-100 text-black text-center rounded-[15px] border-0 cursor-pointer w-full font-semibold transition-all duration-300 active:scale-95 mt-auto"
                    style={{
                      fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                      padding: "clamp(12px, 2vw, 16px)",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
