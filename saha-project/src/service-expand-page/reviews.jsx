import { useState } from "react";
import ReviewForm from "./review-form";

export default function Review() {
  const [reviews, setReviews] = useState([
    {
      author: "John Williams",
      rating: "5/5",
      date: "Dec 3, 2024",
      text: "Öncü said the distance makes this opening special.",
    },
    {
      author: "John Williams",
      rating: "5/5",
      date: "Dec 3, 2024",
      text: "Öncü said the distance makes this opening special.",
    },
    {
      author: "John Williams",
      rating: "5/5",
      date: "Dec 3, 2024",
      text: "Öncü said the distance makes this opening special.",
    },
    {
      author: "John Williams",
      rating: "5/5",
      date: "Dec 3, 2024",
      text: "Öncü said the distance makes this opening special.",
    },
  ]);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="flex flex-col items-start w-full gap-6">
      {/* Review Form */}
      <ReviewForm onSubmit={handleAddReview} />

      {/* Reviews List */}
      <div className="flex flex-col items-start w-full bg-[#161616F0] py-6 px-6 rounded-[40px] inter-regular">
        <span className="text-white text-lg mb-6 inter-semi-bold">
          {"Customer Reviews"}
        </span>
        {reviews.map((review, index) => (
          <div key={index} className="w-full">
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
        ))}
      </div>
    </div>
  );
}
