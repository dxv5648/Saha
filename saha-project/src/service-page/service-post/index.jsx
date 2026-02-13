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

    // Default rating/reviews for new services (computed from reviews later)
    const rating = 0;
    const reviews = 0;

    try {
      setIsUploading(true);

      // Upload image
      const imageUrl = await imageUpload.uploadImage();

      // Ensure a matching locations row exists and get its id.
      // (If you already have a stricter schema/unique constraint, we can switch
      // this to an upsert. For now, we do a simple lookup then insert.)
      const locName = locationAutocomplete.location.trim();
      const locCity = locationAutocomplete.city.trim();
      const locRegion = locationAutocomplete.region.trim();
      const locCountry = locationAutocomplete.country.trim();

      let locationId = null;
      {
        const { data: existingLoc, error: findErr } = await supabase
          .from("locations")
          .select("id")
          .eq("name", locName)
          .eq("city", locCity)
          .eq("region", locRegion)
          .eq("country", locCountry)
          .maybeSingle();
        if (findErr) throw findErr;

        if (existingLoc?.id) {
          locationId = existingLoc.id;
        } else {
          const { data: createdLoc, error: createErr } = await supabase
            .from("locations")
            .insert({
              name: locName,
              city: locCity,
              region: locRegion,
              postal_code: locationAutocomplete.postalCode.trim() || null,
              latitude: 0,
              longitude: 0,
              country: locCountry,
              country_code: "NZ",
            })
            .select("id")
            .single();
          if (createErr) throw createErr;
          locationId = createdLoc?.id ?? null;
        }
      }

      // Submit for approval (DB-backed moderation queue)
      // NOTE: This bypasses Edge Functions. Admin status is stored in `profiles.is_admin`.
      const { error } = await supabase
        .from("service_submissions")
        .insert({
          name: name.trim(),
          provider: provider.trim(),
          category,
          description: description.trim(),
          location_id: locationId,
          service_list: serviceListArray.join(","),
          service_price: servicePriceArray.join(","),
          image_url: imageUrl,
          status: "pending",
        })
  .select("*")
  .single();

      if (error) {
        console.error(error);
        alert("Error submitting service for approval: " + error.message);
      } else {
        // Reset all fields
        setName("");
        setProvider("");
        setCategory("");
        setDescription("");
        locationAutocomplete.resetLocation();
        imageUpload.resetImage();
        serviceEntries.resetServices();

        alert(
          "Submitted! An admin will review your service before it appears on the website.",
        );
      }
    } catch (err) {
      console.error("Error adding service:", err);
      const msg = err?.message || "Error adding service. Please try again.";
      // Show a friendlier message for generic network errors
      if (msg.toLowerCase().includes("failed to fetch")) {
        alert("Network error while posting service. Please check your connection and try again.");
      } else {
        alert(msg);
      }
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
                  onChange={(e) =>
                    locationAutocomplete.setCountry(e.target.value)
                  }
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
                  Region
                </label>
                <input
                  type="text"
                  value={locationAutocomplete.region}
                  onChange={(e) =>
                    locationAutocomplete.setRegion(e.target.value)
                  }
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
                  onChange={(e) =>
                    locationAutocomplete.setPostalCode(e.target.value)
                  }
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
