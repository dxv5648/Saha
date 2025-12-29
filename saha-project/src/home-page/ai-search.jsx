import AI from "../assets/Google-AI-Logo.png";

export default function about() {
  return (
    <div className="flex flex-col items-center self-stretch">
      <div className="flex flex-col items-start  mt-[211px] mb-[261px]">
        <span className="text-white text-6xl font-bold mt-[26px] mb-[38px] mx-[21px]">
          {"What service do you require?"}
        </span>
        <div className="flex items-center bg-[#121212B0] py-[13px] mb-[39px] ml-[72px] rounded-[50px]">
          <img src={AI} className="w-[50px] h-[50px] ml-[25px] object-fill" />
          <span className="text-[#BABABA] text-xl ml-3 mr-[500px]">
            {"Cleaner"}
          </span>
          <button className="bg-[transparent] text-white text-xl font-bold py-[10px] px-[25px] rounded-[30px] mr-[10px]">
            {" "}
            {"🡢"}
          </button>
        </div>
      </div>
    </div>
  );
}
