export default function CartItems() {
  const cartItems = [
    {
      title: "Master Electrician: John Williams",
      time: "Dec 19th, 8:00 AM",
      cost: "$100",
      image:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/fanfsbph_expires_30_days.png",
    },
    {
      title: "Master Electrician: John Williams",
      time: "Dec 19th, 8:00 AM",
      cost: "$100",
      image:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/sgqwlp4o_expires_30_days.png",
    },
    {
      title: "Master Electrician: John Williams",
      time: "Dec 19th, 8:00 AM",
      cost: "$100",
      image:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/f4iytygw_expires_30_days.png",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h2 className="text-white text-2xl inter-semi-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-[#D1D1D1] text-lg">Your cart is empty</span>
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-6 bg-[#161616F0] p-6 rounded-[20px] hover:bg-[#1C1C1C] transition inter-regular"
            >
              <img
                src={item.image}
                className="w-32 h-32 object-cover rounded-lg shrink-0"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <span className="text-white text-base font-semibold block mb-2">
                    {item.title}
                  </span>
                  <span className="text-[#D1D1D1] text-sm block mb-3">
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">
                    {item.cost}
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-[#1C1C1CB0] text-[#D1D1D1] text-xs py-2 px-4 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
                      onClick={() => alert("Edit time")}
                    >
                      Edit Time
                    </button>
                    <button
                      className="text-[#800000] text-sm hover:text-red-500 transition font-medium"
                      onClick={() => alert("Remove item")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            className="flex items-center justify-center bg-[#161616F0] text-white text-base font-semibold py-4 rounded-[20px] hover:bg-[#1C1C1C] transition mt-4"
            onClick={() => alert("Add more services")}
          >
            + Add More Services
          </button>
        </>
      )}
    </div>
  );
}
