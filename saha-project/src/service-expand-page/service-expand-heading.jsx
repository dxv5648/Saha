import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function ServiceExpandHeader({ service = {} }) {
  const {
    id,
    name = "",
    provider = "",
    priceRange = "",
    category = "",
  } = service;

  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);

  // Fetch reviews and calculate rating
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("Review")
          .select("Stars")
          .eq("service_id", id);

        if (error) {
          console.error("Error fetching reviews:", error);
          setRating(0);
          setReviews(0);
        } else if (data && data.length > 0) {
          // Calculate average rating
          const totalStars = data.reduce((sum, review) => sum + review.Stars, 0);
          const averageRating = totalStars / data.length;
          // Round to 1 decimal place
          setRating(parseFloat(averageRating.toFixed(1)));
          setReviews(data.length);
        } else {
          setRating(0);
          setReviews(0);
        }
      } catch (error) {
        console.error("Unexpected error fetching reviews:", error);
        setRating(0);
        setReviews(0);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <div className="relative w-full max-w-300 mb-6 rounded-lg overflow-hidden">
      <img
        src={WorkImage}
        className="w-full h-44.75 object-cover"
        alt={name || "Service"}
      />
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
        }}
      ></div>
      
      {/* Category badge */}
      {category && (
        <div className="absolute top-4 right-4 bg-black/70 px-4 py-2 rounded-lg z-10">
          <span className="text-white font-bold text-sm">{category}</span>
        </div>
      )}
      
      {/* Content overlaid on image */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        
        {/* Service Name */}
        <h1 className="text-white text-3xl font-bold mb-2 inter-semi-bold">
          {name || "Service"}
        </h1>
        
        {/* Provider */}
        {provider && (
          <p className="text-[#D1D1D1] text-base mb-4">
            By {provider}
          </p>
        )}
        
        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-white font-semibold text-lg">
              {rating > 0 ? rating : "N/A"}
            </span>
            <span className="text-[#BABABA] text-base">
              ({reviews})
            </span>
          </div>
          {priceRange && (
            <span className="text-white font-semibold text-lg">
              {priceRange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
