export default function PaymentMethods() {
  return (
    <div className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full">
      <span className="text-white text-lg mt-[30px] mb-5 ml-10">
        {"Payment Methods"}
      </span>
      <span className="text-white text-sm mb-[9px] ml-[27px]">{"Name"}</span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-3 pr-[394px] mb-1.5 mx-[27px] rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">{"John Williams"}</span>
      </div>
      <span className="text-white text-sm mb-1.5 ml-[27px]">{"Email"}</span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-3 pr-[298px] mb-[7px] ml-[27px] rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">
          {"john.williams@example.com"}
        </span>
      </div>
      <span className="text-white text-sm mb-[5px] ml-[27px]">
        {"Card Number"}
      </span>
      <div className="flex flex-col items-start bg-[#1C1C1CB0] py-[15px] pl-[7px] pr-[360px] mb-1.5 ml-[27px] rounded-[10px] border border-solid border-[#434343]">
        <span className="text-[#D1D1D1] text-sm">{"•••• •••• •••• 1111"}</span>
      </div>
      <button
        className="flex flex-col items-start bg-white text-left py-[15px] px-[197px] mb-3.5 ml-[27px] rounded-[10px] border-0"
        onClick={() => alert("Pressed!")}
      >
        <span className="text-black text-sm">{"Add New Card"}</span>
      </button>
    </div>
  );
}
