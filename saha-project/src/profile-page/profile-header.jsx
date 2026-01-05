export default function ProfileHeader() {
  return (
    <div className="flex flex-col items-center self-stretch py-[62px] gap-10">
      <div className="flex flex-col items-center bg-[#161616F0] px-[386px] rounded-[40px]">
        <img
          src={
            "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/xzduvii3_expires_30_days.png"
          }
          className="w-32 h-32 mt-[21px] mb-[13px] object-fill"
        />
        <span className="text-white text-3xl mb-[13px]">{"John Williams"}</span>
        <span className="text-[#D1D1D1] text-sm mb-[13px]">
          {"Member  •  Auckland, New Zealand"}
        </span>
        <div className="flex items-start mb-11 gap-2.5">
          <button
            className="flex flex-col shrink-0 items-start bg-white text-left py-4 px-11 rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-lg">{"Edit Profile"}</span>
          </button>
          <button
            className="flex flex-col shrink-0 items-start bg-white text-left py-4 px-[51px] rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-lg">{"Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
