export default function Contact() {
  return (
    <div className="flex flex-col items-start gap-[47px]">
      <span className="text-white text-3xl font-bold ml-[502px]">
        {"Contact"}
      </span>
      <div className="flex items-start">
        <div className="flex flex-col items-center bg-[#121212B0] w-[531px] px-[30px] mr-[81px] rounded-[20px]">
          <span className="text-white text-3xl font-bold mt-[57px] mb-14">
            {"Get in Touch"}
          </span>
          <div className="flex flex-col items-start self-stretch pb-1.5 mb-[242px]">
            <div className="flex items-start pt-1.5 pb-[29px] mb-6 gap-4">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/0mre9l5y_expires_30_days.png"
                }
                className="w-[18px] h-8 object-fill"
              />
              <div className="flex flex-col items-start w-[217px] gap-[13px]">
                <span className="text-white text-lg font-bold mr-[141px]">
                  {"Address"}
                </span>
                <span className="text-gray-300 text-lg">
                  {"123 Queen Street Auckland CBD Auckland 1010, New Zealand"}
                </span>
              </div>
            </div>
            <div className="flex items-start py-[5px] mb-7 gap-4">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/va6qjuk4_expires_30_days.png"
                }
                className="w-6 h-8 object-fill"
              />
              <div className="flex flex-col items-start w-[132px] gap-3.5">
                <span className="text-white text-lg font-bold mr-[87px]">
                  {"Email"}
                </span>
                <span className="text-gray-300 text-lg">
                  {"hello@saha.nz support@saha.nz"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[17px]">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/v9se0alc_expires_30_days.png"
                }
                className="w-6 h-8 object-fill"
              />
              <div className="flex flex-col items-start w-[119px] gap-[13px]">
                <span className="text-white text-lg font-bold mr-[62px]">
                  {"Phone"}
                </span>
                <span className="text-gray-300 text-lg">
                  {"+64 9 123 4567"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-[#121212B0] w-[531px] pt-[49px] pb-[18px] px-[27px] gap-[50px] rounded-[20px]">
          <span className="text-white text-3xl font-bold">
            {"Send an email"}
          </span>
          <input
            placeholder={"Name"}
            value={input1}
            onChange={(event) => onChangeInput1(event.target.value)}
            className="self-stretch text-[#BABABA] bg-[#0F0F0F] text-lg py-4 px-3.5 mx-[19px] rounded-[10px] border border-solid border-[#BABABA]"
          />
          <input
            placeholder={"your.email@example.com"}
            value={input2}
            onChange={(event) => onChangeInput2(event.target.value)}
            className="self-stretch text-[#BABABA] bg-[#0F0F0F] text-lg py-4 px-3.5 mx-[19px] rounded-[10px] border border-solid border-[#BABABA]"
          />
          <div className="flex flex-col items-start self-stretch bg-[#0F0F0F] pl-3.5 mx-[19px] rounded-[10px] border border-solid border-[#BABABA]">
            <span className="text-[#BABABA] text-lg mt-4 mb-36">
              {"Your Message..."}
            </span>
          </div>
          <button
            className="flex flex-col items-center self-stretch bg-white text-left py-[15px] rounded-[20px] border-0"
            onClick={() => alert("Pressed!")}
          >
            <span className="text-black text-3xl">{"View more"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
