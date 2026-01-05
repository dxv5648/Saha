export default function RecentServices() {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full">
        <span className="text-white text-lg mt-[30px] mb-5 ml-[34px]">
          {"Recent Bookings"}
        </span>
        <div className="flex items-center bg-[#1C1C1CB0] py-2.5 mb-[39px] mx-6 rounded-[20px] border border-solid border-[#434343]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/77n9nlug_expires_30_days.png"
            }
            className="w-[66px] h-[73px] ml-4 mr-[11px] object-fill"
          />
          <div className="flex flex-col shrink-0 items-start mr-[282px]">
            <span className="text-white text-sm mb-[9px] mr-[11px]">
              {"Master Electrician"}
            </span>
            <span className="text-[#D1D1D1] text-sm mb-1">
              {"December 12, 2023"}
            </span>
            <button
              className="flex flex-col items-start bg-[#434343] text-left py-[3px] px-3 mr-[25px] rounded-[10px] border-0"
              onClick={() => alert("Pressed!")}
            >
              <span className="text-white text-sm">{"View Details"}</span>
            </button>
          </div>
        </div>
        <span className="text-[#D1D1D1] text-sm mb-[47px] ml-[161px]">
          {"No more recent booking to display"}
        </span>
      </div>
    </div>
  );
}
