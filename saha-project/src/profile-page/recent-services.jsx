export default function RecentServices() {
  return (
    <div className="flex flex-col items-start w-full">
      <div
        className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full"
        style={{ padding: "clamp(20px, 3vw, 30px)" }}
      >
        <span
          className="text-white mb-5"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          {"Recent Bookings"}
        </span>
        <div
          className="flex items-center bg-[#1C1C1CB0] w-full mb-[39px] rounded-[20px] border border-solid border-[#434343]"
          style={{
            padding: "clamp(10px, 2vw, 16px)",
            gap: "clamp(8px, 1.5vw, 11px)",
          }}
        >
          <div className="flex flex-col items-start flex-grow">
            <span
              className="text-white mb-[9px]"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
            >
              {"Master Electrician"}
            </span>
            <span
              className="text-[#D1D1D1] mb-1"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
            >
              {"December 12, 2023"}
            </span>
            <button
              className="bg-[#434343] text-white rounded-[10px] border-0 cursor-pointer hover:bg-[#555]"
              style={{
                fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                padding: "clamp(2px, 0.5vw, 3px) clamp(8px, 1.5vw, 12px)",
              }}
              onClick={() => alert("Pressed!")}
            >
              {"View Details"}
            </button>
          </div>
        </div>
        <span
          className="text-[#D1D1D1] text-center w-full mb-[47px]"
          style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
        >
          {"No more recent booking to display"}
        </span>
      </div>
    </div>
  );
}
