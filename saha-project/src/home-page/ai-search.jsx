import { useState } from "react";
import { searchWithAI } from "../ai/aiService";
import AISearchResults from "../ai/AISearchResults";
import { useNavigate } from "react-router-dom";

export default function About() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getCurrentPosition = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 5000 },
      );
    });

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Try to obtain user's geolocation to help filter nearby services
      const coords = await getCurrentPosition();
      const searchResults = await searchWithAI(inputValue.trim(), { coords });
      // Navigate to the Services page and pass results in location state
      navigate("/Service", { state: { aiResults: searchResults } });
      setResults(null);
    } catch (err) {
      console.error("Error searching with AI:", err);
      setError(
        err.message ||
          "Failed to search. Please check your API key and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const handleCloseResults = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center mt-52.75 mb-65.25 w-full px-[10vw]">
      <span
        className="text-gray-300 poppins-bold mt-6.5 mb-9.5 text-center w-full max-w-200 whitespace-nowrap"
        style={{ fontSize: "clamp(1.5rem, 5vw, 3.75rem)" }}
      >
        {"What service do you require?"}
      </span>
      <div
        className="flex items-center bg-[#0a0a0a] mb-9.75 rounded-[50px] w-full max-w-200 border border-[#2a2a2a] shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ padding: "clamp(8px, 1.5vw, 13px)" }}
      >
        <input
          type="text"
          placeholder="Describe your requirements..."
          className="bg-transparent inter-regular text-gray-400 grow outline-none placeholder-gray-600 focus:text-gray-200 transition-colors"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            marginLeft: "clamp(15px, 2vw, 25px)",
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-white text-black font-bold rounded-[30px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all duration-200 hover:shadow-lg"
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            padding: "clamp(6px, 1vw, 10px) clamp(15px, 2vw, 25px)",
            marginRight: "clamp(6px, 1vw, 10px)",
          }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "..." : "🡢"}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-400 text-center text-sm">{error}</div>
      )}
      {results && (
        <AISearchResults results={results} onClose={handleCloseResults} />
      )}
    </div>
  );
}
