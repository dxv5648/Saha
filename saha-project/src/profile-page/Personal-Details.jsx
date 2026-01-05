export default function PaymentMethods() {
  return (
    <div className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full">
      <span className="text-white text-lg mt-[37px] mb-[3px] ml-[39px]">
        {"Personal Deails"}
      </span>
      <span className="text-white text-sm mb-1.5 ml-7">{"Time Zone"}</span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-[11px] pr-[329px] mb-[13px] mx-[27px] rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">
          {"Auckland (GMT +13:00)"}
        </span>
      </div>
      <span className="text-white text-sm mb-2.5 ml-[34px]">{"Name"}</span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-1.5 pr-[400px] mb-[13px] ml-7 rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">{"John Williams"}</span>
      </div>
      <span className="text-white text-sm mb-1.5 ml-7">{"Email"}</span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-3 pr-[298px] mb-1.5 ml-7 rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">
          {"john.williams@example.com"}
        </span>
      </div>
      <button
        className="flex flex-col items-start bg-white text-left py-2.5 px-9 mb-[13px] ml-[187px] rounded-[10px] border-0"
        onClick={() => alert("Pressed!")}
      >
        <span className="text-black text-lg">{"Save Details"}</span>
      </button>
    </div>
  );
}
