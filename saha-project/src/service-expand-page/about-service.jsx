export default function AboutService({ serviceName, description }) {
  return (
    <div className="flex flex-col items-start self-stretch bg-[#161616F0] pt-6 pb-6 px-6 mb-6 rounded-[40px]">
      <span className="text-white text-lg inter-semi-bold mb-3.5">
        {serviceName ? `About ${serviceName}` : "About Service"}
      </span>
      <span className="text-[#D1D1D1] inter-regular mb-6 whitespace-pre-line">
        {description || "No description available."}
      </span>
    </div>
  );
}
