export default function PaymentMethods() {
  return (
    <div
      className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full max-w-150 mx-auto inter-regular"
      style={{ padding: "clamp(20px, 3vw, 30px)" }}
    >
      <span
        className="text-white mb-5 inter-semi-bold"
        style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
      >
        {"Payment Methods"}
      </span>

      <span
        className="text-white mb-2.25"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Name"}
      </span>
      <input
        type="text"
        defaultValue="John Williams"
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-1.5 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <span
        className="text-white mb-1.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Email"}
      </span>
      <input
        type="email"
        defaultValue="john.williams@example.com"
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-1.75 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <span
        className="text-white mb-1.25"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Card Number"}
      </span>
      <input
        type="text"
        defaultValue="•••• •••• •••• 1111"
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-1.5 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <button
        className="bg-white inter-regular text-black w-full rounded-[10px] border-0 cursor-pointer hover:bg-gray-100"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
          marginTop: "clamp(8px, 1.5vw, 14px)",
        }}
        onClick={() => alert("Pressed!")}
      >
        {"Add New Card"}
      </button>
    </div>
  );
}
