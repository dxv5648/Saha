import { Link } from "react-router-dom";

export default function ServiceOverview() {
  return (
    <div className="flex flex-col items-center mb-[132px] w-full px-[10vw]">
      <span
        className="text-white font-bold mb-[72px]"
        style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
      >
        {"Services"}
      </span>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-[1200px]"
        style={{
          gap: "clamp(30px, 5vw, 58px)",
          marginBottom: "clamp(30px, 4vw, 50px)",
        }}
      >
        <Link
          //href="/services/home"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(30px, 5vw, 65px)",
            gap: "clamp(12px, 2vw, 18px)",
          }}
        >
          <span
            className="text-white whitespace-nowrap overflow-hidden text-ellipsis w-full text-center"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.875rem)" }}
          >
            {"Home Services"}
          </span>
        </Link>
        <Link
          //href="/services/professional"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(15px, 2vw, 21px)",
            gap: "clamp(14px, 2vw, 21px)",
          }}
        >
          <span
            className="text-white whitespace-nowrap overflow-hidden text-ellipsis w-full text-center"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.875rem)" }}
          >
            {"Professional Services"}
          </span>
        </Link>
        <Link
          //href="/services/creative"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(30px, 4vw, 49px)",
            gap: "clamp(12px, 2vw, 18px)",
          }}
        >
          <span
            className="text-white whitespace-nowrap"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)" }}
          >
            {"Creative Services"}
          </span>
        </Link>

        <Link
          //href="/services/home"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(30px, 5vw, 65px)",
            gap: "clamp(12px, 2vw, 18px)",
          }}
        >
          <span
            className="text-white"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)" }}
          >
            {"Home Services"}
          </span>
        </Link>
        <Link
          //href="/services/professional"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(15px, 2vw, 21px)",
            gap: "clamp(14px, 2vw, 21px)",
          }}
        >
          <span
            className="text-white"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)" }}
          >
            {"Professional Services"}
          </span>
        </Link>
        <Link
          //href="/services/creative"
          className="flex flex-col items-center bg-[#121212B0] text-left rounded-[20px] border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          style={{
            padding: "clamp(40px, 6vw, 68px) clamp(30px, 4vw, 49px)",
            gap: "clamp(12px, 2vw, 18px)",
          }}
        >
          <span
            className="text-white whitespace-nowrap overflow-hidden text-ellipsis w-full text-center"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.875rem)" }}
          >
            {"Creative Services"}
          </span>
        </Link>
      </div>
    </div>
  );
}
