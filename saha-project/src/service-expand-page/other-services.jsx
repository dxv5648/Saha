export default function OtherServices() {
  return (
    <div className="flex flex-col items-start self-stretch bg-[#161616F0] pt-7.5 pr-5.25 inter-regular rounded-[40px]">
      <span className="text-white text-lg mb-3 ml-7.75 inter-semi-bold">
        {"Other Services You Might Like"}
      </span>
      <div className="flex items-start self-stretch mb-3.25 ml-5.25 gap-9.5">
        <div className="flex flex-1 flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/tu3ruzix_expires_30_days.png"
            }
            className="w-40.75 h-36.75 mb-0.75 object-fill"
          />
          <span className="text-white text-sm mb-px ml-2">
            {"Certified Plumber"}
          </span>
          <span className="text-white text-xs ml-2">{"By Sarah Johnson"}</span>
          <div className="flex justify-center items-start self-stretch mb-1 mx-4 gap-5.5">
            <span className="text-white text-xs">{"4.9 (120)"}</span>
            <span className="text-white text-xs">{"$70-120/hr"}</span>
          </div>
          <button
            className="flex flex-col items-center self-stretch bg-white text-left py-1.25 mx-4 rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-sm">{"Book Now"}</span>
          </button>
        </div>
        <div className="flex flex-1 flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/7ed7zetb_expires_30_days.png"
            }
            className="w-40.75 h-36.75 mb-0.75 object-fill"
          />
          <span className="text-white text-sm mb-px ml-2.25">
            {"Master Electrician"}
          </span>
          <span className="text-white text-xs ml-2">{"By John Williams"}</span>
          <div className="flex justify-center items-start self-stretch mb-1 mx-4 gap-5.5">
            <span className="text-white text-xs">{"4.8 (158)"}</span>
            <span className="text-white text-xs">{"$80-150/hr"}</span>
          </div>
          <button
            className="flex flex-col items-center self-stretch bg-white text-left py-1.25 mx-4 rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-sm">{"Book Now"}</span>
          </button>
        </div>
        <div className="flex flex-1 flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/ickrl1pv_expires_30_days.png"
            }
            className="w-40.75 h-36.75 mb-0.75 object-fill"
          />
          <span className="text-white text-sm mb-px ml-2.25">
            {"Professional Cleaner"}
          </span>
          <span className="text-white text-xs ml-2">{"By Mike Brown"}</span>
          <div className="flex justify-between items-start self-stretch mb-1 mx-4">
            <span className="text-white text-xs">{"4.7 (95)"}</span>
            <span className="text-white text-xs">{"$50-100/hr"}</span>
          </div>
          <button
            className="flex flex-col items-center self-stretch bg-white text-left py-1.25 mx-4 rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-sm">{"Book Now"}</span>
          </button>
        </div>
        <div className="flex flex-1 flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA]">
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/6bk3ycox_expires_30_days.png"
            }
            className="w-40.75 h-36.75 mb-0.75 object-fill"
          />
          <div className="flex flex-col items-start self-stretch ml-2 mr-5">
            <span className="text-white text-sm ml-px">
              {"Landscape Designer"}
            </span>
            <span className="text-white text-xs">{"By Emily Clark"}</span>
          </div>
          <div className="flex justify-between items-start self-stretch mb-1 mx-4">
            <span className="text-white text-xs">{"4.6 (80)"}</span>
            <span className="text-white text-xs">{"$60-110/hr"}</span>
          </div>
          <button
            className="flex flex-col items-center self-stretch bg-white text-left py-1.25 mx-4 rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-sm">{"Book Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
