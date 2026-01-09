import { useState, useMemo } from "react";
import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import Filter from "./filter.jsx";
import ServiceIcon from "./service-icon.jsx";
import Background from "../home-page/Background.jsx";
import { SERVICES_DATA } from "./service-db-temp.jsx";

const SERVICES_PER_PAGE = 9;

export default function Service() {
  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Featured");

  const categories = [
    "All Categories",
    ...new Set(SERVICES_DATA.map((s) => s.category)),
  ];

  const filteredServices = useMemo(() => {
    let services = SERVICES_DATA.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    if (sortBy === "Title (A-Z)") {
      services.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Rating (High-Low)") {
      services.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Price (Low-High)") {
      services.sort((a, b) => {
        const aPrice = parseInt(a.priceRange.split("-")[0].replace(/\D/g, ""));
        const bPrice = parseInt(b.priceRange.split("-")[0].replace(/\D/g, ""));
        return aPrice - bPrice;
      });
    }

    return services;
  }, [searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + SERVICES_PER_PAGE
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setCurrentPage(1);
  };

  return (
    <div className="w-full relative">
      <Background />
      <div className="relative z-10">
        <Filter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full px-[2vw]"
          style={{
            gap: "clamp(2px, 0.25vw, 4px)",
            marginBottom: "clamp(40px, 6vw, 80px)",
          }}
        >
          {paginatedServices.map((service) => (
            <ServiceIcon key={service.id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center text-white text-xl py-12">
            No services found matching your criteria.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-white text-black"
                      : " text-white hover:bg-[#0F0F0FB5]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
