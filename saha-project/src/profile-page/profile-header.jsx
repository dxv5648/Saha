import Face from "../assets/Face.jpg";

export default function ProfileHeader() {
  return (
    <div
      className="flex flex-col items-center self-stretch gap-10"
      style={{ padding: "clamp(30px, 5vw, 62px) clamp(20px, 3vw, 30px)" }}
    >
      <div
        className="flex flex-col items-center bg-[#161616F0] rounded-[40px] w-full max-w-[900px]"
        style={{ padding: "clamp(20px, 3vw, 30px)" }}
      >
        <img
          src={Face}
          className="object-fill rounded-full mb-[13px]"
          style={{
            width: "clamp(80px, 12vw, 128px)",
            height: "clamp(80px, 12vw, 128px)",
            marginTop: "clamp(10px, 2vw, 21px)",
          }}
        />
        <span
          className="text-white mb-[13px] text-center"
          style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
        >
          {"John Williams"}
        </span>
        <span
          className="text-[#D1D1D1] mb-[13px] text-center"
          style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
        >
          {"Member  •  Auckland, New Zealand"}
        </span>
        <div
          className="flex flex-col sm:flex-row items-center w-full justify-center"
          style={{
            marginBottom: "clamp(30px, 4vw, 44px)",
            gap: "clamp(8px, 1.5vw, 10px)",
          }}
        >
          <button
            className="bg-white text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 44px)",
            }}
            onClick={() => alert("Pressed!")}
          >
            {"Edit Profile"}
          </button>
          <button
            className="bg-white text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 51px)",
            }}
            onClick={() => alert("Pressed!")}
          >
            {"Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
