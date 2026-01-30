export default function LocationInput({
  location,
  handleLocationChange,
  onFocus,
  locationSuggestions,
  showSuggestions,
  handleLocationSelect,
  locationInputRef,
}) {
  return (
    <div ref={locationInputRef} className="relative">
      <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
        Location Search *
      </label>
      <input
        type="text"
        placeholder="Enter location (e.g., Auckland, Franklin)"
        value={location}
        onChange={(e) => handleLocationChange(e.target.value)}
        onFocus={onFocus}
        className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
        style={{
          fontSize: "clamp(0.75rem, 2vw, 1rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />
      {showSuggestions && locationSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-[#252525] to-[#1C1C1C] border border-solid border-[#434343] rounded-[12px] max-h-80 overflow-y-auto z-50 shadow-lg shadow-black/50 backdrop-blur-sm">
          {locationSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleLocationSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer hover:bg-[#333333] transition-all duration-200 text-white inter-regular text-sm flex items-start gap-2 ${
                index !== locationSuggestions.length - 1
                  ? "border-b border-[#353535]"
                  : ""
              }`}
            >
              <span className="text-[#666] mt-0.5">📍</span>
              <span className="flex-1">{suggestion.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
