export default function ServiceEntriesSection({
  services,
  addServiceEntry,
  removeServiceEntry,
  updateServiceEntry,
}) {
  return (
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
                  updateServiceEntry(index, "service_list", e.target.value)
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
                  updateServiceEntry(index, "service_price", e.target.value)
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
  );
}
