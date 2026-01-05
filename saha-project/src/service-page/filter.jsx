import { useState } from "react";

export default function filter() {
  const [input1, setInput1] = useState("");

  return (
    <div
      className="flex flex-col items-start self-stretch relative"
      style={{ marginBottom: "clamp(100px, 15vw, 286px)" }}
    >
      <div className="self-stretch ">
        <div
          className="flex flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA] "
          style={{
            padding: "clamp(20px, 3vw, 42px) clamp(20px, 3vw, 52px)",
            margin: "clamp(30px, 5vw, 60px) clamp(20px, 5vw, 74px)",
          }}
        >
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center self-stretch mb-2.5"
            style={{ gap: "clamp(15px, 2vw, 20px)" }}
          >
            <span
              className="text-white font-bold"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
            >
              {"Find The Perfect Service"}
            </span>
            <button
              className="bg-white text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                padding: "clamp(12px, 2vw, 16px) clamp(30px, 5vw, 96px)",
              }}
              onClick={() => alert("Pressed!")}
            >
              {"Compare"}
            </button>
          </div>
          <span
            className="text-white mb-[30px]"
            style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
          >
            {"Browse through our trusted service providers"}
          </span>
          <div
            className="flex flex-col lg:flex-row items-start self-stretch w-full"
            style={{
              gap: "clamp(15px, 2.5vw, 33px)",
              marginBottom: "clamp(15px, 2vw, 27px)",
            }}
          >
            <div className="flex flex-1 items-center bg-[#0F0F0F] rounded-[25px] border border-solid border-[#BABABA] w-full">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/9lidi5l2_expires_30_days.png"
                }
                className="object-fill flex-shrink-0"
                style={{
                  width: "clamp(18px, 2vw, 23px)",
                  height: "clamp(17px, 2vw, 22px)",
                  marginLeft: "clamp(15px, 2vw, 20px)",
                  marginRight: "clamp(6px, 1vw, 8px)",
                }}
              />
              <input
                placeholder={"Search for plumbers, electricians..."}
                value={input1}
                onChange={(event) => setInput1(event.target.value)}
                className="flex-1 self-stretch text-white bg-transparent border-0 outline-none placeholder-gray-400"
                style={{
                  fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                  padding: "clamp(14px, 2vw, 18px) clamp(4px, 1vw, 4px)",
                }}
              />
            </div>
            <button
              className="flex items-center bg-[#0F0F0F] text-left rounded-[25px] border border-solid border-[#BABABA] cursor-pointer hover:bg-[#1a1a1a] w-full lg:w-auto justify-between"
              style={{
                fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                padding: "clamp(14px, 2vw, 17px) clamp(15px, 2vw, 18px)",
                gap: "clamp(20px, 5vw, 99px)",
              }}
              onClick={() => alert("Pressed!")}
            >
              <span className="text-white whitespace-nowrap">
                {"All Categories"}
              </span>
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/2fqviavt_expires_30_days.png"
                }
                className="object-fill flex-shrink-0"
                style={{
                  width: "clamp(20px, 2.5vw, 25px)",
                  height: "clamp(14px, 1.7vw, 17px)",
                }}
              />
            </button>
            <button
              className="flex items-center bg-[#0F0F0F] text-left rounded-[25px] border border-solid border-[#BABABA] cursor-pointer hover:bg-[#1a1a1a] w-full lg:w-auto justify-between"
              style={{
                fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                padding: "clamp(14px, 2vw, 17px) clamp(15px, 2vw, 22px)",
                gap: "clamp(20px, 4vw, 67px)",
              }}
              onClick={() => alert("Pressed!")}
            >
              <span className="text-white whitespace-nowrap">
                {"Sort By: Featured"}
              </span>
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/fnh78bg4_expires_30_days.png"
                }
                className="object-fill flex-shrink-0"
                style={{
                  width: "clamp(20px, 2.5vw, 25px)",
                  height: "clamp(14px, 1.7vw, 17px)",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
