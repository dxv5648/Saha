import AI from "../assets/Google-AI-Logo.png";

export default function about() {
  return (
    <div className="flex flex-col items-center mt-[211px] mb-[261px] w-full px-[10vw]">
      <span
        className="text-white font-bold mt-[26px] mb-[38px] text-center w-full max-w-[800px] whitespace-nowrap"
        style={{ fontSize: "clamp(1.5rem, 5vw, 3.75rem)" }}
      >
        {"What service do you require?"}
      </span>
      <div
        className="flex items-center bg-[#121212B0] mb-[39px] rounded-[50px] w-full max-w-[800px]"
        style={{ padding: "clamp(8px, 1.5vw, 13px)" }}
      >
        <img
          src={AI}
          className="object-fill flex-shrink-0"
          style={{
            width: "clamp(30px, 5vw, 50px)",
            height: "clamp(30px, 5vw, 50px)",
            marginLeft: "clamp(15px, 2vw, 25px)",
          }}
        />
        <input
          type="text"
          placeholder="Cleaner"
          className="bg-transparent text-[#BABABA] flex-grow outline-none placeholder-[#BABABA]"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            marginLeft: "clamp(8px, 1vw, 12px)",
          }}
        />
        <button
          className="bg-[transparent] text-white font-bold rounded-[30px] flex-shrink-0"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            padding: "clamp(6px, 1vw, 10px) clamp(15px, 2vw, 25px)",
            marginRight: "clamp(6px, 1vw, 10px)",
          }}
        >
          {" "}
          {"🡢"}
        </button>
      </div>
    </div>
  );
}
