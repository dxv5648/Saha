import Electrician from "../assets/Electrician.jpg";

export default function FavouriteServices() {
  return (
    <div
      className="flex flex-col items-center bg-[#161616F0] rounded-[40px] w-full"
      style={{ padding: "clamp(20px, 3vw, 24px)" }}
    >
      <span
        className="text-white mb-[39px]"
        style={{
          fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
          marginTop: "clamp(20px, 3vw, 42px)",
        }}
      >
        {"Favourite Services"}
      </span>
      <div
        className="flex flex-col sm:flex-row items-start w-full justify-center mb-[61px]"
        style={{ gap: "clamp(15px, 2.5vw, 20px)" }}
      >
        <div
          className="flex flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA] w-full sm:w-auto"
          style={{ paddingBottom: "clamp(8px, 1.5vw, 10px)" }}
        >
          <img
            src={Electrician}
            className="w-full object-cover rounded-t-[30px]"
            style={{
              height: "clamp(180px, 25vw, 231px)",
              marginBottom: "clamp(8px, 1.5vw, 10px)",
            }}
          />
          <span
            className="text-white mb-2"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              marginLeft: "clamp(15px, 2vw, 21px)",
            }}
          >
            {"Master Electrician"}
          </span>
          <span
            className="text-white"
            style={{
              fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
              marginLeft: "clamp(15px, 2vw, 21px)",
            }}
          >
            {"By John Williams"}
          </span>
        </div>
        <div
          className="flex flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA] w-full sm:w-auto"
          style={{ paddingBottom: "clamp(8px, 1.5vw, 10px)" }}
        >
          <img
            src={Electrician}
            className="w-full object-cover rounded-t-[30px]"
            style={{
              height: "clamp(180px, 25vw, 231px)",
              marginBottom: "clamp(8px, 1.5vw, 10px)",
            }}
          />
          <span
            className="text-white mb-2"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              marginLeft: "clamp(15px, 2vw, 21px)",
            }}
          >
            {"Master Electrician"}
          </span>
          <span
            className="text-white"
            style={{
              fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
              marginLeft: "clamp(15px, 2vw, 21px)",
            }}
          >
            {"By John Williams"}
          </span>
        </div>
      </div>
    </div>
  );
}
