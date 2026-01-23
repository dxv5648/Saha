import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WorkImage from "../assets/Work-imgae.png";
import supabase from "../supabase-client";

export default function ServiceIcon({ service = {} }) {
  const navigate = useNavigate();
  const {
    id = 1,
    name = "Master Electrician",
    provider = "John Williams",
    category = "Electrical",
    priceRange = "$80-150/hr",
    image_url = null,
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
          const totalStars = data.reduce(
            (sum, review) => sum + review.Stars,
            0,
          );
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

  const handleBookNow = () => {
    navigate(`/service/${id}`);
  };

  return (
    <div
      className="flex items-start w-full px-[2vw]"
      style={{ marginBottom: "clamp(80px, 12vw, 151px)" }}
    >
      <div
        className="flex flex-1 flex-col items-start bg-linear-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[30px] overflow-hidden shadow-2xl hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105"
        style={{
          transform: "perspective(1000px)",
        }}
      >
        <div className="relative w-full overflow-hidden">
          <img
            src={image_url || WorkImage}
            className="w-full object-cover rounded-t-[30px] transition-transform duration-500 hover:scale-110"
            style={{
              height: "clamp(250px, 35vw, 393px)",
              marginBottom: "clamp(6px, 1vw, 9px)",
            }}
            alt={name}
          />
          <div className="absolute top-0 right-0 bg-linear-to-l from-black to-transparent px-4 py-2 rounded-bl-xl">
            <span
              className="text-white font-bold"
              style={{
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              }}
            >
              {category}
            </span>
          </div>
        </div>

        <div
          className="w-full px-[clamp(12px,2vw,18px)]"
          style={{ paddingTop: "clamp(12px, 2vw, 18px)" }}
        >
          <span
            className={`text-white block mb-2 leading-tight ${
              name === "Master Electrician"
                ? "inter-semi-bold"
                : "inter-regular"
            }`}
            style={{
              fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
            }}
          >
            {name}
          </span>

          <span
            className="text-[#BABABA] text-sm block mb-4"
            style={{
              fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
            }}
          >
            By {provider}
          </span>

          <div
            className="flex items-center justify-between w-full mb-5 bg-[#0F0F0F] bg-opacity-50 rounded-[15px] px-3 py-2"
            style={{
              gap: "clamp(4px, 1vw, 5px)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-yellow-400"
                style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
              >
                ★
              </span>
              <span
                className="text-white font-semibold"
                style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
              >
                {rating > 0 ? rating : "N/A"}
              </span>
              <span
                className="text-[#BABABA]"
                style={{ fontSize: "clamp(0.7rem, 1.3vw, 0.8rem)" }}
              >
                {`(${reviews})`}
              </span>
            </div>
            <span
              className="text-white font-semibold ml-auto"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
            >
              {priceRange}
            </span>
          </div>

          <button
            className="bg-linear-to-r from-white to-gray-200 text-black text-center rounded-[20px] border-0 cursor-pointer w-full font-semibold transition-all duration-300 hover:from-gray-100 hover:to-gray-300 hover:shadow-lg active:scale-95"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              padding: "clamp(14px, 2vw, 18px)",
              marginBottom: "clamp(16px, 2vw, 20px)",
            }}
            onClick={handleBookNow}
          >
            {"Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
