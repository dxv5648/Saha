export default function FavouriteServices() {
  return (
    <div className="flex flex-col items-center bg-[#161616F0] px-6 rounded-[40px] w-full">
      <span className="text-white text-3xl mt-[42px] mb-[39px]">
        {"Favourite Services"}
      </span>
      <div className="flex items-start mb-[61px] gap-5">
        <div className="flex flex-col shrink-0 items-start bg-[#121212B0] pb-2.5 rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/3meho1py_expires_30_days.png"
            }
            className="w-[241px] h-[231px] mb-2.5 object-fill"
          />
          <span className="text-white text-lg mb-2 ml-[21px]">
            {"Master Electrician"}
          </span>
          <span className="text-white text-sm ml-[21px]">
            {"By John Williams"}
          </span>
        </div>
        <div className="flex flex-col shrink-0 items-start bg-[#121212B0] pb-2.5 rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/278pq7fd_expires_30_days.png"
            }
            className="w-[241px] h-[231px] mb-2.5 object-fill"
          />
          <span className="text-white text-lg mb-2 ml-[21px]">
            {"Master Electrician"}
          </span>
          <span className="text-white text-sm ml-[21px]">
            {"By John Williams"}
          </span>
        </div>
      </div>
    </div>
  );
}
