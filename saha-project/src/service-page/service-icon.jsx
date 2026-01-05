export default function ServiceIcon() {
  return (
    <div
      className="flex items-start w-full px-[5vw]"
      style={{ marginBottom: "clamp(80px, 12vw, 151px)" }}
    >
      <div className="flex flex-1 flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA] max-w-[450px]">
        <img
          src={
            "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/zsd0xlij_expires_30_days.png"
          }
          className="w-full object-cover rounded-t-[30px]"
          style={{
            height: "clamp(250px, 35vw, 393px)",
            marginBottom: "clamp(6px, 1vw, 9px)",
          }}
        />
        <span
          className="text-white mb-[15px]"
          style={{
            fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
            marginLeft: "clamp(12px, 2vw, 18px)",
          }}
        >
          {"Master Electrician"}
        </span>
        <span
          className="text-white mb-[15px]"
          style={{
            fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
            marginLeft: "clamp(12px, 2vw, 18px)",
          }}
        >
          {"By John Williams"}
        </span>
        <div
          className="flex items-center self-stretch mb-[21px]"
          style={{
            marginLeft: "clamp(12px, 2vw, 18px)",
            marginRight: "clamp(12px, 2vw, 18px)",
            gap: "clamp(4px, 1vw, 5px)",
          }}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/s5pdap6f_expires_30_days.png"
            }
            className="object-fill flex-shrink-0"
            style={{
              width: "clamp(12px, 1.5vw, 14px)",
              height: "clamp(12px, 1.5vw, 14px)",
            }}
          />
          <span
            className="text-white"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
          >
            {"4.8 (158)"}
          </span>
          <div className="flex-1"></div>
          <span
            className="text-white"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
          >
            {"$80-150/hr"}
          </span>
        </div>
        <button
          className="bg-white text-black text-center rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
            padding: "clamp(12px, 2vw, 16px)",
            margin: "0 clamp(20px, 4vw, 41px) clamp(8px, 1.5vw, 11px)",
          }}
          onClick={() => alert("Pressed!")}
        >
          {"Book Now"}
        </button>
      </div>
    </div>
  );
}
