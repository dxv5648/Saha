export default function ServiceOverview() {
  return (
    <div className="flex flex-col items-center mb-[132px]">
      <span className="text-white text-3xl font-bold mb-[72px]">
        {"Services"}
      </span>
      <div className="grid grid-cols-3 mb-[50px] gap-[58px]">
        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[65px] gap-[18px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/6stvzqdh_expires_30_days.png"
            }
            className="w-10 h-9 object-fill"
          />
          <span className="text-white text-3xl">{"Home Services"}</span>
        </button>
        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[21px] gap-[21px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/xmydqrk2_expires_30_days.png"
            }
            className="w-9 h-[33px] object-fill"
          />
          <span className="text-white text-3xl">{"Professional Services"}</span>
        </button>
        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[49px] gap-[18px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/b6rag6df_expires_30_days.png"
            }
            className="w-[38px] h-9 object-fill"
          />
          <span className="text-white text-3xl">{"Creative Services"}</span>
        </button>

        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[65px] gap-[18px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/6stvzqdh_expires_30_days.png"
            }
            className="w-10 h-9 object-fill"
          />
          <span className="text-white text-3xl">{"Home Services"}</span>
        </button>
        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[21px] gap-[21px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/xmydqrk2_expires_30_days.png"
            }
            className="w-9 h-[33px] object-fill"
          />
          <span className="text-white text-3xl">{"Professional Services"}</span>
        </button>
        <button
          className="flex flex-col items-center bg-[#121212B0] text-left w-[345px] py-[68px] px-[49px] gap-[18px] rounded-[20px] border-0"
          onClick={() => alert("Pressed!")}
        >
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/b6rag6df_expires_30_days.png"
            }
            className="w-[38px] h-9 object-fill"
          />
          <span className="text-white text-3xl">{"Creative Services"}</span>
        </button>
      </div>
    </div>
  );
}
