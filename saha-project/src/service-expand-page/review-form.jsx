import { useState } from "react";
import supabase from "../supabase-client";

export default function ReviewForm({ onSubmit, serviceId }) {
  const [formData, setFormData] = useState({
    author: "",
    rating: "5",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.text.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (!serviceId) {
      alert("Service ID is missing. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert review into database
          const { error } = await supabase
        .from("Review")
        .insert([
          {
            user_name: formData.author.trim(),
            Stars: parseInt(formData.rating),
            description: formData.text.trim(),
            service_id: serviceId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        alert("Error submitting review: " + error.message);
        setIsSubmitting(false);
        return;
      }

      // Create review object for local state update
      const newReview = {
        author: formData.author,
        rating: `${formData.rating}/5`,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        text: formData.text,
      };

      // Call onSubmit callback if provided (for local state update)
      if (onSubmit) {
        onSubmit(newReview);
      }

      // Reset form
      setFormData({ author: "", rating: "5", text: "" });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#161616F0] py-6 px-6 rounded-[40px]">
      <span className="text-white text-lg mb-6 inter-semi-bold block">
        {"Post a Review"}
      </span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[#D1D1D1] text-sm">Name</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full bg-[#252525] text-white text-sm px-3 py-2 rounded-lg border border-[#353535] focus:outline-none focus:border-[#555555]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#D1D1D1] text-sm">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full bg-[#252525] text-white text-sm px-3 py-2 rounded-lg border border-[#353535] focus:outline-none focus:border-[#555555]"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#D1D1D1] text-sm">Review</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Write your review..."
            rows="4"
            className="w-full bg-[#252525] text-white text-sm px-3 py-2 rounded-lg border border-[#353535] focus:outline-none focus:border-[#555555] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white hover:bg-[#D1D1D1] text-black font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
