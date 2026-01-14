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

    const newServiceData = {
      name: name.trim(),
      provider: provider.trim(),
      category: category,
      description: description.trim(),
      service_list: serviceListArray.join(","),
      service_price: servicePriceArray.join(","),
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
      setServices([{ service_list: "", service_price: "" }]);
      alert("Service added successfully!");
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
              Name *
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
                          e.target.value
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
                          e.target.value
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
            className="bg-white hover:bg-gray-100 text-black w-full rounded-[10px] border-0 cursor-pointer inter-semi-bold transition-colors active:scale-95 transform"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              padding: "clamp(12px, 2vw, 16px)",
              marginTop: "clamp(8px, 1.5vw, 12px)",
            }}
          >
            Post Service
          </button>
        </div>
      </div>
    </div>
  );
}
