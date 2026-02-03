export const validateForm = (
  name,
  provider,
  category,
  description,
  location,
  locationSelected,
  country,
  city,
  region,
  image,
  services,
) => {
  if (!name.trim()) {
    return "Please enter a service name";
  }
  if (!provider.trim()) {
    return "Please enter a provider";
  }
  if (!category) {
    return "Please select a category";
  }
  if (!description.trim()) {
    return "Please enter a description";
  }
  if (!location.trim()) {
    return "Please enter a location";
  }
  if (!locationSelected) {
    return "Please select a location from the suggestions";
  }
  if (!country.trim()) {
    return "Please enter a country";
  }
  if (!city.trim()) {
    return "Please enter a city";
  }
  if (!image) {
    return "Please select an image for the service";
  }

  // Validate all service entries
  for (let i = 0; i < services.length; i++) {
    if (!services[i].service_list.trim()) {
      return `Please enter a service name for service ${i + 1}`;
    }
    if (!services[i].service_price.trim()) {
      return `Please enter a price for service ${i + 1}`;
    }
    const priceValue = parseFloat(services[i].service_price);
    if (isNaN(priceValue) || priceValue < 0) {
      return `Please enter a valid price for service ${i + 1}`;
    }
  }

  return null;
};
