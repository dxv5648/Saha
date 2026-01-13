export default function ServiceBook() {
  return (
    <div className="flex flex-col items-start w-full bg-[#161616F0] py-6 px-6 rounded-[40px] inter-regular">
      <span className="text-white text-lg mb-6 inter-semi-bold">
        {"Book This Service"}
      </span>
      <div className="w-full">
        <span className="text-white text-sm mb-2 block">{"Select Date"}</span>
        <div className="flex flex-col items-start bg-[#1C1C1CB0] py-3 px-2 mb-4 rounded-[10px] border border-solid border-[#434343] w-full">
          <span className="text-[#D1D1D1] text-sm">{"dd/mm/yyyy"}</span>
        </div>
      </div>
      <div className="w-full">
        <span className="text-white text-sm mb-2 block">{"Select Time"}</span>
        <div className="flex flex-col items-start bg-[#1C1C1CB0] py-3 px-2 mb-4 rounded-[10px] border border-solid border-[#434343] w-full">
          <span className="text-[#D1D1D1] text-sm">{"Choose time slot"}</span>
        </div>
      </div>
      <button
        className="w-full bg-white text-black text-sm py-3 mb-3 rounded-[10px] border-0 font-medium"
        onClick={() => alert("Pressed!")}
      >
        {"Book"}
      </button>
      <button
        className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 mb-4 rounded-[10px] border border-solid border-[#434343]"
        onClick={() => alert("Pressed!")}
      >
        {"Add to Favorites"}
      </button>
      <div className="w-full bg-[#353535] h-px mb-4"></div>
      <div className="flex justify-between w-full text-[#D1D1D1] text-sm">
        <span>{"Response time"}</span>
        <span>{"Within 1 hour"}</span>
      </div>
    </div>
  );
}
