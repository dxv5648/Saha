import { useState } from "react";

export default function Filter({
  searchQuery = "",
  onSearchChange = () => {},
  selectedCategory = "All Categories",
  categories = ["All Categories"],
  onCategoryChange = () => {},
  sortBy = "Featured",
  onSortChange = () => {},
  isCompareMode = false,
  onCompareClick = () => {},
  selectedCount = 0,
  onConfirmCompare = () => {},
}) {
  const [showCategories, setShowCategories] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div
      className="flex flex-col items-start self-stretch relative"
      style={{ marginBottom: "clamp(40px, 8vw)" }}
    >
      <div className="self-stretch ">
        <div
          className="flex flex-col items-start bg-[#121212B0] rounded-[30px]  "
          style={{
            padding: "clamp(20px, 3vw, 42px) clamp(20px, 3vw, 52px)",
            margin: "clamp(30px, 5vw, 60px) clamp(20px, 5vw, 74px)",
          }}
        >
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center self-stretch mb-2.5"
            style={{ gap: "clamp(15px, 2vw, 20px)" }}
          >
            <span
              className="text-white poppins-bold"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
            >
              {"Find The Perfect Service"}
            </span>
            <div className="flex items-center gap-2">
              {isCompareMode && (
                <button
                  className="bg-green-600 inter-regular text-white rounded-[20px] border-0 cursor-pointer hover:bg-green-700 whitespace-nowrap"
                  style={{
                    fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                    padding: "clamp(12px, 2vw, 16px) clamp(20px, 4vw, 40px)",
                  }}
                  onClick={onConfirmCompare}
                >
                  {`Confirm Compare (${selectedCount}/3)`}
                </button>
              )}
              <button
                className={`inter-regular rounded-[20px] border-0 cursor-pointer whitespace-nowrap ${
                  isCompareMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-white hover:bg-gray-100 text-black"
                }`}
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                  padding: "clamp(12px, 2vw, 16px) clamp(30px, 5vw, 96px)",
                }}
                onClick={onCompareClick}
              >
                {isCompareMode ? "Cancel Compare" : "Compare"}
              </button>
            </div>
          </div>
          <span
            className="text-white inter-regular mb-7.5"
            style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
          >
            {"Browse through our trusted service providers"}
          </span>
          <div
            className="flex flex-col lg:flex-row items-start self-stretch w-full"
            style={{
              gap: "clamp(15px, 2.5vw, 33px)",
              marginBottom: "clamp(15px, 2vw, 27px)",
            }}
          >
            <div className="flex flex-1 inter-regular items-center bg-[#1f1f1f] rounded-[25px]  w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 shrink-0"
                style={{
                  width: "clamp(18px, 2vw, 23px)",
                  height: "clamp(17px, 2vw, 22px)",
                  marginLeft: "clamp(15px, 2vw, 20px)",
                  marginRight: "clamp(6px, 1vw, 8px)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder={"Search for plumbers, electricians..."}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="flex-1 self-stretch text-white bg-transparent border-0 outline-none placeholder-gray-400"
                style={{
                  fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                  padding: "clamp(14px, 2vw, 18px) clamp(4px, 1vw, 4px)",
                }}
              />
            </div>
            <div className="relative w-full lg:w-auto">
              <button
                className="flex items-center inter-regular bg-[#1f1f1f] text-left rounded-[25px] cursor-pointer hover:bg-[#1a1a1a] w-full lg:w-auto justify-between"
                style={{
                  fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                  padding: "clamp(14px, 2vw, 17px) clamp(15px, 2vw, 18px)",
                  gap: "clamp(20px, 5vw, 99px)",
                }}
                onClick={() => setShowCategories(!showCategories)}
              >
                <span className="text-white whitespace-nowrap">
                  {selectedCategory}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white shrink-0"
                  style={{
                    width: "clamp(20px, 2.5vw, 25px)",
                    height: "clamp(14px, 1.7vw, 17px)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 right-0 lg:left-0 mt-2 bg-[#0F0F0F]  rounded-[15px] z-50 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowCategories(false);
                      }}
                      className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] ${
                        selectedCategory === category ? "bg-[#1a1a1a]" : ""
                      }`}
                      style={{
                        fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                      }}
                    >
                      <span className="text-white">{category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-auto">
              <button
                className="flex items-center inter-regular bg-[#1f1f1f] text-left rounded-[25px]  cursor-pointer hover:bg-[#1a1a1a] w-full lg:w-auto justify-between"
                style={{
                  fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                  padding: "clamp(14px, 2vw, 17px) clamp(15px, 2vw, 22px)",
                  gap: "clamp(20px, 4vw, 67px)",
                }}
                onClick={() => setShowSort(!showSort)}
              >
                <span className="text-white whitespace-nowrap">
                  {`Sort By: ${sortBy}`}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white shrink-0"
                  style={{
                    width: "clamp(20px, 2.5vw, 25px)",
                    height: "clamp(14px, 1.7vw, 17px)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showSort && (
                <div className="absolute top-full left-0 right-0 lg:left-0 mt-2 bg-[#0F0F0F]  rounded-[15px] z-50 max-h-64 overflow-y-auto">
                  {[
                    "Featured",
                    "Title (A-Z)",
                    "Rating (High-Low)",
                    "Price (Low-High)",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onSortChange(option);
                        setShowSort(false);
                      }}
                      className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] ${
                        sortBy === option ? "bg-[#1a1a1a]" : ""
                      }`}
                      style={{
                        fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                      }}
                    >
                      <span className="text-white">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
