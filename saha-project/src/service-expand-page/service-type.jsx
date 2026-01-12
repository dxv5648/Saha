export default function ServiceType() {
  const services = [
    { name: "Floor", price: "$80" },
    { name: "Wall", price: "$80" },
    { name: "House", price: "$80" },
    { name: "Car", price: "$80" },
  ];

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
