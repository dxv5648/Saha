import { useState, useRef, useEffect } from "react";

export const useLocationAutocomplete = () => {
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("New Zealand");
  const locationInputRef = useRef(null);
  const debounceTimer = useRef(null);

  const fetchLocationSuggestions = async (value) => {
    if (value.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(value)},New Zealand&limit=10`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();

      if (data && Array.isArray(data)) {
        const nzBoundingBox = {
          minLat: -47.3,
          maxLat: -34.4,
          minLon: 166.4,
          maxLon: 178.6,
        };

        const suggestions = data
          .filter((item) => {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            return (
              lat >= nzBoundingBox.minLat &&
              lat <= nzBoundingBox.maxLat &&
              lon >= nzBoundingBox.minLon &&
              lon <= nzBoundingBox.maxLon
            );
          })
          .map((item) => ({
            id: item.place_id,
            name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: item.address,
          }))
          .slice(0, 5);

        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleLocationChange = (value) => {
    setLocation(value);

    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer for 0.5 seconds
    debounceTimer.current = setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 500);
  };

  const handleLocationSelect = (suggestion) => {
    const address = suggestion.address || {};
    const extractedCity = address.state || address.state_district || "";
    const extractedRegion = address.county || address.district || "";
    const extractedPostalCode = address.postcode || "";

    setLocation(suggestion.name);
    setCity(extractedCity);
    setRegion(extractedRegion);
    setPostalCode(extractedPostalCode);
    setCountry("New Zealand");
    setLocationSelected(true);
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside and cleanup debounce timer on unmount
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const resetLocation = () => {
    setLocation("");
    setCity("");
    setRegion("");
    setPostalCode("");
    setCountry("New Zealand");
    setLocationSelected(false);
  };

  return {
    location,
    setLocation,
    locationSuggestions,
    setLocationSuggestions,
    showSuggestions,
    setShowSuggestions,
    locationSelected,
    setLocationSelected,
    city,
    setCity,
    region,
    setRegion,
    postalCode,
    setPostalCode,
    country,
    setCountry,
    locationInputRef,
    handleLocationChange,
    handleLocationSelect,
    resetLocation,
  };
};
