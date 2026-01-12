export default function OrderSummary() {
  return (
    <div className="w-96 flex flex-col bg-[#161616F0] p-8 rounded-[20px] h-fit sticky top-8 inter-regular">
      <span className="text-white text-2xl inter-semi-bold mb-8">
        Order Summary
      </span>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[#D1D1D1] text-sm">Subtotal (3 Services)</span>
          <span className="text-white text-sm">$400</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#D1D1D1] text-sm">Booking Fee</span>
          <span className="text-white text-sm">$10</span>
        </div>
      </div>

      <div className="bg-[#353535] h-px mb-6"></div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-white text-lg">Total</span>
        <span className="text-white text-2xl">$410</span>
      </div>

      <button
        className="w-full bg-white text-black text-base py-4 rounded-[15px] hover:bg-gray-100 transition mb-3"
        onClick={() => alert("Proceed to payment")}
      >
        Proceed to Payment
      </button>

      <button
        className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 rounded-[15px] border border-[#434343] hover:bg-[#2C2C2C] transition"
        onClick={() => alert("Continue shopping")}
      >
        Continue Shopping
      </button>
    </div>
  );
}
