export default function CartHeader() {
  return (
    <div>
      <div className="flex flex-col items-center self-stretch mb-4 inter-semi-bold">
        <span className="text-white text-3xl">{"Booking Basket"}</span>
      </div>
      <div className="flex flex-col items-center self-stretch mb-20 inter-regular">
        <span className="text-[#D1D1D1] text-lg">{"Review your booking"}</span>
      </div>
    </div>
  );
}
