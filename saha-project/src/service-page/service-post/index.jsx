import { useState } from "react";
import supabase from "../../supabase-client";
import { CATEGORIES } from "./constants";
import { validateForm } from "./validations";
import { useLocationAutocomplete } from "./useLocationAutocomplete";
import { useImageUpload } from "./useImageUpload";
import { useServiceEntries } from "./useServiceEntries";
import LocationInput from "./LocationInput";
import ImageUploadField from "./ImageUploadField";
import ServiceEntriesSection from "./ServiceEntriesSection";

export default function ServicePost() {
  const [serviceName, setServiceName] = useState([]);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const locationAutocomplete = useLocationAutocomplete();
  const imageUpload = useImageUpload();
  const serviceEntries = useServiceEntries();

  const addService = async () => {
    // Validate form
    const validationError = validateForm(
      name,
      provider,
      category,
      description,
      locationAutocomplete.location,
      locationAutocomplete.locationSelected,
      locationAutocomplete.country,
      locationAutocomplete.city,
      locationAutocomplete.region,
      imageUpload.image,
      serviceEntries.services,
    );

    if (validationError) {
      alert(validationError);
      return;
    }

    const { serviceListArray, servicePriceArray } =
      serviceEntries.getServiceArrays();

    // Generate random rating and reviews
    const rating = (Math.random() * 1.0 + 4.0).toFixed(1);
    const reviews = Math.floor(Math.random() * 251 + 50);

    try {
      setIsUploading(true);

      // Upload image
      const imageUrl = await imageUpload.uploadImage();

      // Create location record
      const locationData = {
        name: locationAutocomplete.location.trim(),
        city: locationAutocomplete.city.trim(),
        region: locationAutocomplete.region.trim(),
        postal_code: locationAutocomplete.postalCode.trim() || null,
        latitude: 0,
        longitude: 0,
        country: locationAutocomplete.country.trim(),
        country_code: "NZ",
      };

      const { data: locationRecord, error: locationError } = await supabase
        .from("locations")
        .insert([locationData])
        .select()
        .single();

      if (locationError) {
        throw new Error("Error creating location: " + locationError.message);
      }

      // Create service record
      const newServiceData = {
        name: name.trim(),
        provider: provider.trim(),
        category: category,
        description: description.trim(),
        location_id: locationRecord.id,
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
        locationAutocomplete.resetLocation();
        imageUpload.resetImage();
        serviceEntries.resetServices();

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

          <LocationInput
            location={locationAutocomplete.location}
            handleLocationChange={locationAutocomplete.handleLocationChange}
            onFocus={() =>
              locationAutocomplete.location.length >= 3 &&
              locationAutocomplete.setShowSuggestions(true)
            }
            locationSuggestions={locationAutocomplete.locationSuggestions}
            showSuggestions={locationAutocomplete.showSuggestions}
            handleLocationSelect={locationAutocomplete.handleLocationSelect}
            locationInputRef={locationAutocomplete.locationInputRef}
          />

          {locationAutocomplete.locationSelected && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
                  Country *
                </label>
                <input
                  type="text"
                  value={locationAutocomplete.country}
                  onChange={(e) => locationAutocomplete.setCountry(e.target.value)}
                  className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    padding: "clamp(12px, 2vw, 15px)",
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
                  City *
                </label>
                <input
                  type="text"
                  value={locationAutocomplete.city}
                  onChange={(e) => locationAutocomplete.setCity(e.target.value)}
                  className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    padding: "clamp(12px, 2vw, 15px)",
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
                  Region *
                </label>
                <input
                  type="text"
                  value={locationAutocomplete.region}
                  onChange={(e) => locationAutocomplete.setRegion(e.target.value)}
                  className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    padding: "clamp(12px, 2vw, 15px)",
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-[#D1D1D1] text-sm inter-semi-bold">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={locationAutocomplete.postalCode}
                  onChange={(e) => locationAutocomplete.setPostalCode(e.target.value)}
                  className="w-full bg-[#1C1C1CB0] text-white placeholder:text-gray-400 inter-regular rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] transition-colors"
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    padding: "clamp(12px, 2vw, 15px)",
                  }}
                />
              </div>
            </div>
          )}

          <ImageUploadField
            handleImageChange={imageUpload.handleImageChange}
            imagePreview={imageUpload.imagePreview}
          />

          <ServiceEntriesSection
            services={serviceEntries.services}
            addServiceEntry={serviceEntries.addServiceEntry}
            removeServiceEntry={serviceEntries.removeServiceEntry}
            updateServiceEntry={serviceEntries.updateServiceEntry}
          />

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
