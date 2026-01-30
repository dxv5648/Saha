import { useMemo, useState } from "react";
import { searchWithAI } from "../ai/aiService";
import AISearchResults from "../ai/AISearchResults";
import { useNavigate } from "react-router-dom";

export default function About() {
  const filterTabs = useMemo(
    () => [
      { id: "location", label: "Location" },
      { id: "price", label: "Price" },
      { id: "rating", label: "Rating" },
      { id: "reviews", label: "Reviews" },
      { id: "service", label: "Service" },
      { id: "category", label: "Category" },
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      "Electrical",
      "Plumbing",
      "Painting",
      "HVAC",
      "Carpentry",
      "Roofing",
      "Locksmith",
      "Landscaping",
      "Cleaning",
      "Flooring",
    ],
    []
  );

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [useMyLocation, setUseMyLocation] = useState(true);
  const [filters, setFilters] = useState({
    locationText: "",
    minRating: null,
    minReviews: null,
    priceTier: null,
    category: "",
    serviceText: "",
  });

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

  const hasActiveFilters =
    Boolean(filters.locationText) ||
    Boolean(filters.minRating) ||
    Boolean(filters.minReviews) ||
    Boolean(filters.priceTier) ||
    Boolean(filters.category) ||
    Boolean(filters.serviceText) ||
    Boolean(useMyLocation);

  const handleSubmit = async () => {
    if (!inputValue.trim() && !hasActiveFilters) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Try to obtain user's geolocation to help filter nearby services
      const coords = useMyLocation ? await getCurrentPosition() : null;
      const effectiveQuery = inputValue.trim() || "services";
      const searchResults = await searchWithAI(effectiveQuery, {
        coords,
        areaText: filters.locationText,
        filters,
      });
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

  const toggleTab = (tabId) => {
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  };

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const updateFilterValue = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      locationText: "",
      minRating: null,
      minReviews: null,
      priceTier: null,
      category: "",
      serviceText: "",
    });
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
        <button
          type="button"
          aria-label="Toggle filters"
          className="flex items-center justify-center shrink-0 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition"
          style={{
            width: "clamp(34px, 5vw, 52px)",
            height: "clamp(34px, 5vw, 52px)",
            marginLeft: "clamp(12px, 2vw, 22px)",
          }}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <span className="text-xl">+</span>
        </button>
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
      {showFilters && (
        <div className="w-full max-w-200 mb-7">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => toggleTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === tab.id
                    ? "bg-white text-black border-white"
                    : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto px-3 py-2 rounded-full text-xs border border-white/20 text-white/70 hover:text-white hover:border-white/60"
            >
              Clear all
            </button>
          </div>

          <div className="bg-[#0F0F0FB5] border border-white/10 rounded-[24px] p-4">
            {activeTab === "location" && (
              <div className="flex flex-col gap-3">
                <label className="text-white text-sm">Location</label>
                <input
                  type="text"
                  placeholder="City, suburb, or address"
                  value={filters.locationText}
                  onChange={(e) => updateFilterValue("locationText", e.target.value)}
                  className="w-full bg-[#121212] text-white placeholder:text-gray-500 rounded-[12px] px-4 py-2 border border-white/10 outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => setUseMyLocation((prev) => !prev)}
                  className={`self-start px-3 py-2 rounded-full text-xs border transition ${
                    useMyLocation
                      ? "bg-white text-black border-white"
                      : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                  }`}
                >
                  {useMyLocation ? "Using my location" : "Use my location"}
                </button>
              </div>
            )}

            {activeTab === "price" && (
              <div className="flex flex-wrap gap-2">
                {["budget", "standard", "premium"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => toggleFilterValue("priceTier", tier)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      filters.priceTier === tier
                        ? "bg-white text-black border-white"
                        : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                    }`}
                  >
                    {tier === "budget" && "Budget"}
                    {tier === "standard" && "Standard"}
                    {tier === "premium" && "Premium"}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "rating" && (
              <div className="flex flex-wrap gap-2">
                {[4, 4.5, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleFilterValue("minRating", value)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      filters.minRating === value
                        ? "bg-white text-black border-white"
                        : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                    }`}
                  >
                    {value}★ & up
                  </button>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-wrap gap-2">
                {[50, 100, 200].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleFilterValue("minReviews", value)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      filters.minReviews === value
                        ? "bg-white text-black border-white"
                        : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                    }`}
                  >
                    {value}+ reviews
                  </button>
                ))}
              </div>
            )}

            {activeTab === "service" && (
              <div className="flex flex-col gap-3">
                <label className="text-white text-sm">Service keywords</label>
                <input
                  type="text"
                  placeholder="e.g. rewiring, deep clean, roof repair"
                  value={filters.serviceText}
                  onChange={(e) => updateFilterValue("serviceText", e.target.value)}
                  className="w-full bg-[#121212] text-white placeholder:text-gray-500 rounded-[12px] px-4 py-2 border border-white/10 outline-none focus:border-white/40"
                />
              </div>
            )}

            {activeTab === "category" && (
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleFilterValue("category", cat)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      filters.category === cat
                        ? "bg-white text-black border-white"
                        : "bg-[#121212] text-white border-white/20 hover:border-white/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-400 text-center text-sm">{error}</div>
      )}
      {results && (
        <AISearchResults results={results} onClose={handleCloseResults} />
      )}
    </div>
  );
}
