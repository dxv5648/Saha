export default function ServiceType({ serviceList, servicePrice }) {
  // Parse comma-separated strings into arrays
  let services = [];
  
  if (serviceList && servicePrice && serviceList.trim() && servicePrice.trim()) {
    const serviceNames = serviceList.split(",").map((s) => s.trim()).filter((s) => s);
    const prices = servicePrice.split(",").map((p) => p.trim()).filter((p) => p);
    
    // Match service names with prices
    services = serviceNames.map((name, index) => ({
      name: name,
      price: prices[index] ? `$${parseFloat(prices[index]).toFixed(2)}` : "$0.00",
    }));
  }

  // If no services from database, show empty state or default
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-start self-stretch bg-[#161616F0] py-8 px-6 mb-6 rounded-[40px] inter-regular">
        <span className="text-white text-lg mb-6 inter-semi-bold">
          {"Service & Pricing"}
        </span>
        <span className="text-[#D1D1D1] text-lg">Service pricing information not available.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start self-stretch bg-[#161616F0] py-8 px-6 mb-6 rounded-[40px] inter-regular">
      <span className="text-white text-lg mb-6 inter-semi-bold">
        {"Service & Pricing"}
      </span>
      {services.map((service, index) => (
        <div key={index} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#D1D1D1] text-lg">{service.name}</span>
            <span className="text-[#D1D1D1] text-lg">{service.price}</span>
          </div>
          {index < services.length - 1 && (
            <div className="w-full bg-[#353535] h-px mb-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}
