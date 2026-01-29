export default function ImageUploadField({
  handleImageChange,
  imagePreview,
}) {
  return (
    <div>
      <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
        Service Image *
      </label>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-[#1C1C1CB0] text-white inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] file:bg-[#434343] file:border-0 file:text-white file:px-3 file:py-2 file:rounded-[8px] file:cursor-pointer file:mr-3 transition-colors"
            style={{
              fontSize: "clamp(0.75rem, 2vw, 1rem)",
              padding: "clamp(12px, 2vw, 15px)",
            }}
          />
        </div>
      </div>
      {imagePreview && (
        <div className="mt-4 rounded-[10px] overflow-hidden border border-solid border-[#434343]">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
}
