import { useState } from "react";

export const useServiceEntries = () => {
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

  const getServiceArrays = () => {
    const serviceListArray = services.map((s) => s.service_list.trim());
    const servicePriceArray = services.map((s) => parseFloat(s.service_price));
    return { serviceListArray, servicePriceArray };
  };

  const resetServices = () => {
    setServices([{ service_list: "", service_price: "" }]);
  };

  return {
    services,
    setServices,
    addServiceEntry,
    removeServiceEntry,
    updateServiceEntry,
    getServiceArrays,
    resetServices,
  };
};
