import { useState } from "react";
import supabase from "../supabase-client";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Painting",
  "HVAC",
  "Carpentry",
  "Roofing",
  "Locksmith",
  "Landscaping",
  "Flooring",
  "Appliances",
  "Drywall",
  "Windows",
  "Insulation",
  "Doors",
  "Metal Work",
  "Cleaning",
  "Masonry",
  "Demolition",
  "Siding",
  "Pools",
  "Garage",
];

export default function ServicePost() {
  const [serviceName, setServiceName] = useState([]);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [services, setServices] = useState([
    { service_list: "", service_price: "" },
  ]);

  const addServiceEntry = () => {
    setServices([...services, { service_list: "", service_price: "" }]);
  };

  const removeServiceEntry = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateServiceEntry = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      return null;
    }

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, image, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      throw new Error("Failed to upload image: " + err.message);
    }
  };

  const addService = async () => {
    // Validation
    if (!name.trim()) {
      alert("Please enter a service name");
      return;
    }
    if (!provider.trim()) {
      alert("Please enter a provider");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (!image) {
      alert("Please select an image for the service");
      return;
    }

    // Validate all service entries
    for (let i = 0; i < services.length; i++) {
      if (!services[i].service_list.trim()) {
        alert(`Please enter a service name for service ${i + 1}`);
        return;
      }
      if (!services[i].service_price.trim()) {
        alert(`Please enter a price for service ${i + 1}`);
        return;
      }
      const priceValue = parseFloat(services[i].service_price);
      if (isNaN(priceValue) || priceValue < 0) {
        alert(`Please enter a valid price for service ${i + 1}`);
        return;
      }
    }

    // Create comma-separated arrays for service_list and service_price
    const serviceListArray = services.map((s) => s.service_list.trim());
    const servicePriceArray = services.map((s) => parseFloat(s.service_price));

    // Generate random rating (between 4.0 and 5.0) and reviews (between 50 and 300)
    const rating = (Math.random() * 1.0 + 4.0).toFixed(1);
    const reviews = Math.floor(Math.random() * 251 + 50);

    try {
      setIsUploading(true);

      // Upload image first
      const imageUrl = await uploadImage();

      const newServiceData = {
        name: name.trim(),
        provider: provider.trim(),
        category: category,
        description: description.trim(),
        service_list: serviceListArray.join(","),
        service_price: servicePriceArray.join(","),
        image_url: imageUrl,
        rating: parseFloat(rating),
        reviews: reviews,
      };

      const { data, error } = await supabase
        .from("Services")
        .insert([newServiceData])
        .single();
      if (error) {
        console.error(error);
        alert("Error adding service: " + error.message);
      } else {
        setServiceName((prev) => [...prev, data]);
        // Reset all fields
        setName("");
        setProvider("");
        setCategory("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setServices([{ service_list: "", service_price: "" }]);
        alert("Service added successfully!");
      }
    } catch (err) {
      console.error("Error adding service:", err);
      alert(err.message || "Error adding service. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-black">
      <div className="flex flex-col items-center bg-[#161616F0] backdrop-blur-sm w-full max-w-4xl p-8 rounded-[40px]">
        <h2 className="text-white text-3xl poppins-bold mb-8">
          Post a New Service
        </h2>
        <div className="flex flex-col gap-6 w-full">
          <div>
            <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
              Service Name *
            </label>
            <input
              type="text"
              placeholder="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
              style={{
                fontSize: "clamp(0.75rem, 2vw, 1rem)",
                padding: "clamp(12px, 2vw, 15px)",
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
              Provider *
            </label>
            <input
              type="text"
              placeholder="Provider Name"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
              style={{
                fontSize: "clamp(0.75rem, 2vw, 1rem)",
                padding: "clamp(12px, 2vw, 15px)",
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1C1C1CB0] text-white inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] cursor-pointer transition-colors"
              style={{
                fontSize: "clamp(0.75rem, 2vw, 1rem)",
                padding: "clamp(12px, 2vw, 15px)",
              }}
            >
              <option value="" className="bg-[#1C1C1CB0]">
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1C1C1CB0]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
              Description *
            </label>
            <textarea
              placeholder="Describe your service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] resize-none transition-colors"
              style={{
                fontSize: "clamp(0.75rem, 2vw, 1rem)",
                padding: "clamp(12px, 2vw, 15px)",
              }}
            />
          </div>

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

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[#D1D1D1] text-sm inter-semi-bold">
                Services *
              </label>
              <button
                type="button"
                onClick={addServiceEntry}
                className="bg-[#434343] hover:bg-[#555555] text-white px-4 py-2 rounded-[10px] text-sm inter-semi-bold transition-colors"
                style={{
                  fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                  padding: "clamp(8px, 1.5vw, 12px)",
                }}
              >
                + Add Service
              </button>
            </div>
            {services.map((service, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-[#252525] border border-solid border-[#353535] rounded-[10px]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-[#D1D1D1] inter-semi-bold">
                    Service {index + 1}
                  </span>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceEntry(index)}
                      className="bg-[#5a1a1a] hover:bg-[#7a2a2a] text-white px-3 py-1 rounded-[8px] text-xs inter-semi-bold transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={service.service_list}
                      onChange={(e) =>
                        updateServiceEntry(
                          index,
                          "service_list",
                          e.target.value,
                        )
                      }
                      className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                      style={{
                        fontSize: "clamp(0.75rem, 2vw, 1rem)",
                        padding: "clamp(12px, 2vw, 15px)",
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={service.service_price}
                      onChange={(e) =>
                        updateServiceEntry(
                          index,
                          "service_price",
                          e.target.value,
                        )
                      }
                      className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                      style={{
                        fontSize: "clamp(0.75rem, 2vw, 1rem)",
                        padding: "clamp(12px, 2vw, 15px)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addService}
            disabled={isUploading}
            className="bg-white hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed text-black w-full rounded-[10px] border-0 cursor-pointer inter-semi-bold transition-colors active:scale-95 transform"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              padding: "clamp(12px, 2vw, 16px)",
              marginTop: "clamp(8px, 1.5vw, 12px)",
            }}
          >
            {isUploading ? "Uploading..." : "Post Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
