import { Link } from "react-router-dom";

export default function ServiceOverview() {
  const services = [
    "Electrical",
    "Plumbing",
    "HVAC",
    "Cleaning",
    "Landscaping",
    "Roofing",
    "Painting",
    "Carpentry",
    "Appliances",
  ];

  return (
    <div className="flex flex-col items-center mb-33 w-full px-[10vw]">
      <span
        className="text-white inter-semi-bold mt-36 mb-18"
        style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
      >
        {"Services"}
      </span>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-300"
        style={{
          gap: "clamp(30px, 5vw, 58px)",
          marginBottom: "clamp(30px, 4vw, 50px)",
        }}
      >
        {services.map((service) => (
          <Link
            key={service}
            to={`/Service?service=${encodeURIComponent(service)}&category=${encodeURIComponent(service)}`}
            className="group flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] text-center rounded-[20px] border border-[#333333] cursor-pointer hover:from-[#2a2a2a] hover:to-[#1a1a1a] hover:border-[#555555] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            style={{
              padding: "clamp(40px, 6vw, 68px) clamp(30px, 5vw, 65px)",
              minHeight: "clamp(150px, 20vw, 220px)",
            }}
          >
            <span
              className="text-white inter-semi-bold text-center group-hover:text-blue-400 transition-colors duration-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
            >
              {service}
            </span>
          </Link>
        ))}
      </div>

      <Link to="/Service">
        <button
          className="bg-[white] text-black
           inter-semi-bold rounded-[15px] hover:bg-[#d8d8d8] hover:text-[#1a1a1a] transition-colors"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            padding: "clamp(10px, 1.5vw, 15px) clamp(450px, 4vw, 50px)",
          }}
        >
          View More
        </button>
      </Link>
    </div>
  );
}
