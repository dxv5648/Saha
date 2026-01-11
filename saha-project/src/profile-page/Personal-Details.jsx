import { useState } from "react";

export default function PersonalDetails() {
  const [timezone, setTimezone] = useState("Auckland (GMT +13:00)");
  const [name, setName] = useState("John Williams");
  const [email, setEmail] = useState("john.williams@example.com");
  return (
    <div
      className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full max-w-150 mx-auto inter-regular"
      style={{ padding: "clamp(20px, 3vw, 30px)" }}
    >
      <span
        className="text-white mb-0.75 inter-semi-bold"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.125rem)",
          marginTop: "clamp(7px, 1.5vw, 7px)",
        }}
      >
        {"Personal Details"}
      </span>

      <span
        className="text-white mb-1.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Time Zone"}
      </span>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-3.25 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] cursor-pointer"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      >
        <option value="Auckland (GMT +13:00)">Auckland (GMT +13:00)</option>
        <option value="Sydney (GMT +11:00)">Sydney (GMT +11:00)</option>
        <option value="Tokyo (GMT +9:00)">Tokyo (GMT +9:00)</option>
        <option value="Singapore (GMT +8:00)">Singapore (GMT +8:00)</option>
        <option value="Dubai (GMT +4:00)">Dubai (GMT +4:00)</option>
        <option value="London (GMT +0:00)">London (GMT +0:00)</option>
        <option value="New York (GMT -5:00)">New York (GMT -5:00)</option>
        <option value="Los Angeles (GMT -8:00)">Los Angeles (GMT -8:00)</option>
      </select>

      <span
        className="text-white mb-2.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Name"}
      </span>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-3.25 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <span
        className="text-white mb-1.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Email"}
      </span>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-1.5 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <button
        className="bg-white text-black w-full rounded-[10px] border-0 cursor-pointer hover:bg-gray-100"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.125rem)",
          padding: "clamp(8px, 1.5vw, 10px)",
          marginTop: "clamp(8px, 1.5vw, 13px)",
        }}
        onClick={() => alert("Pressed!")}
      >
        {"Save Details"}
      </button>
    </div>
  );
}
