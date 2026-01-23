import { useState, useEffect } from "react";
import ReviewForm from "./review-form";
import supabase from "../supabase-client";

export default function Review({ serviceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("Review")
          .select("*")
          .eq("service_id", serviceId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
        } else {
          // Transform database data to match UI format
          const transformedReviews = data.map((review) => ({
            id: review.id,
            author: review.user_name,
            rating: `${review.Stars}/5`,
            date: new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            text: review.description,
          }));
          setReviews(transformedReviews);
        }
      } catch (error) {
        console.error("Unexpected error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  const handleAddReview = () => {
    // Refetch reviews from database to include the new review
    const fetchReviews = async () => {
      if (!serviceId) return;

      try {
        const { data, error } = await supabase
          .from("Review")
          .select("*")
          .eq("service_id", serviceId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const transformedReviews = data.map((review) => ({
            id: review.id,
            author: review.user_name,
            rating: `${review.Stars}/5`,
            date: new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            text: review.description,
          }));
          setReviews(transformedReviews);
        }
      } catch (error) {
        console.error("Error refetching reviews:", error);
      }
    };

    fetchReviews();
  };

  return (
    <div className="flex flex-col items-start w-full gap-6">
      {/* Review Form */}
      <ReviewForm onSubmit={handleAddReview} serviceId={serviceId} />

      {/* Reviews List */}
      <div className="flex flex-col items-start w-full bg-[#161616F0] py-6 px-6 rounded-[40px] inter-regular">
        <span className="text-white text-lg mb-6 inter-semi-bold">
          {"Customer Reviews"}
        </span>
        {loading ? (
          <div className="text-[#D1D1D1] text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-[#D1D1D1] text-sm">No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={review.id || index} className="w-full">
              <div className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white text-sm font-medium">
                    {review.author}
                  </span>
                  <span className="text-[#D1D1D1] text-sm">{review.rating}</span>
                </div>
                <span className="text-[#D1D1D1] text-xs block mb-2">
                  {review.date}
                </span>
                <span className="text-[#D1D1D1] text-sm">{review.text}</span>
              </div>
              {index < reviews.length - 1 && (
                <div className="w-full bg-[#353535] h-px mb-4"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
