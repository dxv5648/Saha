import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import AISearchResults from "../ai/AISearchResults";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Filter from "./filter.jsx";
import ServiceIcon from "./service-icon.jsx";
import Background from "../home-page/background.jsx";
import CompareModal from "./compare-modal.jsx";
import supabase from "../supabase-client";

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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Featured");
  const [supabaseServices, setSupabaseServices] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareServiceIds, setCompareServiceIds] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const aiResults = location?.state?.aiResults || null;

  // If AI provided results via navigation state, use them to filter the services list
  useEffect(() => {
    if (aiResults && Array.isArray(aiResults.services)) {
      const ids = aiResults.services.map((s) => s.id);
      setCompareServiceIds(ids);
      setSearchQuery("");
      setSelectedCategory("All Categories");
      setCurrentPage(1);
    }
  }, [aiResults]);

  // Handle category query parameter from service overview
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Handle compare query parameter from AI search
  useEffect(() => {
    const compareParam = searchParams.get("compare");
    if (compareParam) {
      const ids = compareParam.split(",").map((id) => parseInt(id.trim()));
      setCompareServiceIds(ids);
      // Auto-select services for comparison
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("Services")
          .select("*, locations(*)")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching services:", error);
        } else {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from("Review")
            .select("service_id, Stars");

          const reviewsByService = new Map();
          if (!reviewsError && Array.isArray(reviewsData)) {
            reviewsData.forEach((review) => {
              const serviceId = review.service_id;
              if (!reviewsByService.has(serviceId)) {
                reviewsByService.set(serviceId, { count: 0, sum: 0 });
              }
              const entry = reviewsByService.get(serviceId);
              entry.count += 1;
              entry.sum += Number(review.Stars) || 0;
            });
          }

          const computeRating = (service) => {
            if (reviewsError || !Array.isArray(reviewsData)) {
              return {
                rating: Number(service.rating) || 0,
                reviews: Number(service.reviews) || 0,
              };
            }
            const entry = reviewsByService.get(service.id);
            if (!entry || entry.count === 0) {
              return { rating: 0, reviews: 0 };
            }
            const avg = entry.sum / entry.count;
            return {
              rating: parseFloat(avg.toFixed(1)),
              reviews: entry.count,
            };
          };

          if (!reviewsError && Array.isArray(data)) {
            const updatePromises = data.map((service) => {
              const { rating, reviews } = computeRating(service);
              const currentRating = Number(service.rating) || 0;
              const currentReviews = Number(service.reviews) || 0;
              if (currentRating === rating && currentReviews === reviews) {
                return null;
              }
              return supabase
                .from("Services")
                .update({ rating, reviews })
                .eq("id", service.id);
            });

            const pendingUpdates = updatePromises.filter(Boolean);
            if (pendingUpdates.length > 0) {
              await Promise.all(pendingUpdates);
            }
          }

          // Transform Supabase data to match expected format
          const transformedServices = data.map((service, index) => {
            // Calculate priceRange from service_price if available
            let priceRange = "$50-100/hr"; // default
            if (service.service_price) {
              const prices = service.service_price
                .split(",")
                .map((p) => parseFloat(p.trim()))
                .filter((p) => !isNaN(p));
              if (prices.length > 0) {
                const minPrice = Math.round(Math.min(...prices));
                const maxPrice = Math.round(Math.max(...prices));
                priceRange =
                  minPrice === maxPrice
                    ? `$${minPrice}/hr`
                    : `$${minPrice}-${maxPrice}/hr`;
              }
            }

            const computed = computeRating(service);

            return {
              id: service.id || `supabase-${index}`,
              name: service.name,
              provider: service.provider,
              category: service.category,
              rating: computed.rating,
              reviews: computed.reviews,
              priceRange: priceRange,
              image_url: service.image_url,
              location: service.locations,
            };
          });
          setSupabaseServices(transformedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Use only Supabase services
  const allServices = useMemo(() => {
    return supabaseServices;
  }, [supabaseServices]);

  const categories = [
    "All Categories",
    ...new Set(allServices.map((s) => s.category)),
  ];

  const filteredServices = useMemo(() => {
    let services = allServices.filter((service) => {
      // If compareServiceIds is set, only show those services
      if (compareServiceIds.length > 0) {
        if (!compareServiceIds.includes(service.id)) {
          return false;
        }
      }

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
  }, [searchQuery, selectedCategory, sortBy, allServices, compareServiceIds]);

  const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + SERVICES_PER_PAGE,
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

  const handleCompareClick = () => {
    setIsCompareMode(!isCompareMode);
    if (isCompareMode) {
      // 退出比较模式时清空选择
      setSelectedServices([]);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        if (prev.length >= 3) {
          alert("You can only select 3 services to compare");
          return prev;
        }
        return [...prev, service];
      }
    });
  };

  const handleConfirmCompare = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service to compare");
      return;
    }
    setShowCompareModal(true);
  };

  const handleCloseCompareModal = () => {
    setShowCompareModal(false);
    setIsCompareMode(false);
    setSelectedServices([]);
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
          isCompareMode={isCompareMode}
          onCompareClick={handleCompareClick}
          selectedCount={selectedServices.length}
          onConfirmCompare={handleConfirmCompare}
        />
        <h1 className="text-white text-center text-4xl poppins-bold px-[2vw] mb-10">
          Services in your area
        </h1>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full px-[2vw]"
          style={{
            gap: "clamp(2px, 0.25vw, 4px)",
            marginBottom: "clamp(40px, 6vw, 80px)",
          }}
        >
          {/* If the AI produced results and passed them via location state, show them inline here */}
          {aiResults && (
            <div className="col-span-full mb-6">
              <AISearchResults
                results={aiResults}
                inline={true}
                onClose={() => {
                  // Clear location state by navigating to same path without state
                  // and clear AI filters so the full services list is shown again
                  setCompareServiceIds([]);
                  navigate("/Service", { replace: true, state: null });
                }}
              />
            </div>
          )}
          {paginatedServices.map((service) => (
            <ServiceIcon
              key={service.id}
              service={service}
              isCompareMode={isCompareMode}
              isSelected={selectedServices.some((s) => s.id === service.id)}
              onToggleSelect={() => handleServiceToggle(service)}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center inter-regular text-white text-xl py-12">
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
      {showCompareModal && (
        <CompareModal
          services={selectedServices}
          onClose={handleCloseCompareModal}
        />
      )}
    </div>
  );
}
