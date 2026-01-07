import { useState } from "react";
import AI from "../assets/Google-AI-Logo.png";

export default function About() {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      alert(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center mt-52.75 mb-65.25 w-full px-[10vw]">
      <span
        className="text-white poppins-bold mt-6.5 mb-9.5 text-center w-full max-w-200 whitespace-nowrap"
        style={{ fontSize: "clamp(1.5rem, 5vw, 3.75rem)" }}
      >
        {"What service do you require?"}
      </span>
      <div
        className="flex items-center bg-[#0F0F0FB5] mb-9.75 rounded-[50px] w-full max-w-200"
        style={{ padding: "clamp(8px, 1.5vw, 13px)" }}
      >
        <img
          src={AI}
          className="object-fill shrink-0"
          style={{
            width: "clamp(30px, 5vw, 50px)",
            height: "clamp(30px, 5vw, 50px)",
            marginLeft: "clamp(15px, 2vw, 25px)",
          }}
        />
        <input
          type="text"
          placeholder="Describe your requirements..."
          className="bg-transparent inter-regular text-[#BABABA] grow outline-none placeholder-[#BABABA]"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            marginLeft: "clamp(8px, 1vw, 12px)",
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-transparent text-white font-bold rounded-[30px] shrink-0"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            padding: "clamp(6px, 1vw, 10px) clamp(15px, 2vw, 25px)",
            marginRight: "clamp(6px, 1vw, 10px)",
          }}
          onClick={handleSubmit}
        >
          {" "}
          {"🡢"}
        </button>
      </div>
    </div>
  );
}
