import AI from "../assets/Google-AI-Logo.png";

export default function about() {
  return (
    <div className="flex flex-col items-center self-stretch bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/dt7j88n7_expires_30_days.png')] bg-cover bg-center">
      <div className="flex flex-col items-start bg-[#FFFFFF03] mt-[211px] mb-[261px]">
        <span className="text-white text-6xl font-bold mt-[26px] mb-[38px] mx-[21px]">
          {"What service do you require?"}
        </span>
        <div className="flex items-center bg-[#121212B0] py-[13px] mb-[39px] ml-[72px] rounded-[50px]">
          <img src={AI} className="w-[50px] h-[50px] mr-[25px] object-fill" />
          <span className="text-[#BABABA] text-xl mr-[549px]">{"Cleaner"}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 mr-[25px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
