import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "../supabase-client";
import { SYSTEM_PROMPT, getQueryPrompt } from "./prompts.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

let cachedModelName = null;

async function listAvailableModelNames() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey,
      )}`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const models = Array.isArray(json?.models) ? json.models : [];
    // Keep only models that support generateContent
    return models
      .filter((m) => Array.isArray(m?.supportedGenerationMethods))
      .filter((m) => m.supportedGenerationMethods.includes("generateContent"))
      .map((m) => m.name) // e.g. "models/gemini-1.5-flash"
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function resolveGeminiModelName() {
  if (cachedModelName) return cachedModelName;

  // Allow override (either "gemini-1.5-flash" or "models/gemini-1.5-flash")
  const override = import.meta.env.VITE_GEMINI_MODEL;
  if (override) {
    cachedModelName = override.startsWith("models/") ? override : `models/${override}`;
    return cachedModelName;
  }

  // Try live discovery first (works best for free-tier differences)
  const available = await listAvailableModelNames();
  if (available.length > 0) {
    // Prefer flash-style models for speed, then fall back to any supported model.
    const preferred =
      available.find((m) => m.includes("flash")) ||
      available.find((m) => m.includes("pro")) ||
      available[0];
    cachedModelName = preferred;
    return cachedModelName;
  }

  // Fallback guesses (in case listModels is blocked)
  const fallbacks = [
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-1.0-pro",
    "models/gemini-pro",
  ];
  cachedModelName = fallbacks[0];
  return cachedModelName;
}

/**
 * Fetch all services from Supabase
 */
async function fetchAllServices() {
  try {
    const { data, error } = await supabase
      .from("Services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchAllServices:", error);
    throw error;
  }
}

/**
 * Process user query with Gemini AI
 */
async function processQueryWithAI(userQuery, services) {
  try {
    // Prepare services data for AI (simplified structure)
    const servicesForAI = services.map((service) => ({
      id: service.id,
      name: service.name,
      provider: service.provider,
      category: service.category,
      location: service.location || service.city || service.suburb || service.address || "",
      description: service.description || "",
      service_list: service.service_list || "",
      service_price: service.service_price || "",
      rating: service.rating || 0,
      reviews: service.reviews || 0,
    }));

    // Pick a model that is actually available for THIS API key / tier.
    const modelName = await resolveGeminiModelName();
    const model = genAI.getGenerativeModel({ model: modelName });

    // Create the prompt
    const queryPrompt = getQueryPrompt(userQuery, servicesForAI);
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${queryPrompt}`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response (Gemini might add markdown formatting)
    let jsonText = text.trim();
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const parsedResponse = JSON.parse(jsonText);
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw response:", text);
      // Fallback: try to extract JSON from text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error in processQueryWithAI:", error);
    throw error;
  }
}

/**
 * Main function to handle AI search queries
 * @param {string} userQuery - The user's search query
 * @returns {Promise<{type: string, services: Array, reasoning?: string}>}
 */
/**
 * Search with AI with optional location filtering.
 * @param {string} userQuery
 * @param {{coords?: {lat:number,lng:number}, radiusKm?: number, areaText?: string}} options
 */
export async function searchWithAI(userQuery, options = {}) {
  if (!userQuery || !userQuery.trim()) {
    throw new Error("Query cannot be empty");
  }

  try {
    // Check if Gemini API key is configured
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file"
      );
    }

    // Fetch all services from Supabase
    const allServices = await fetchAllServices();

    if (allServices.length === 0) {
      return {
        type: "suggestions",
        services: [],
        reasoning: "No services available in the database",
      };
    }

    // Process query with AI
    const aiResponse = await processQueryWithAI(userQuery, allServices);

    // Extract relevant services based on AI response (backend uses IDs).
    const relevantServiceIds = Array.isArray(aiResponse.serviceIds)
      ? aiResponse.serviceIds
      : [];

    // Map to actual service objects
    let relevantServices = allServices.filter((service) =>
      relevantServiceIds.includes(service.id)
    );

    // If AI returned no IDs, fall back to a fuzzy match on category/name/description
    if (relevantServices.length === 0) {
      const q = userQuery.toLowerCase();
      relevantServices = allServices
        .filter((s) => {
          return (
            (s.name || "").toLowerCase().includes(q) ||
            (s.category || "").toLowerCase().includes(q) ||
            (s.description || "").toLowerCase().includes(q) ||
            (s.service_list || "").toLowerCase().includes(q)
          );
        })
        .slice(0, 10);
    }

    // If location info was provided, apply location filtering / ranking
  const { coords, radiusKm = 50, areaText, filters = {} } = options || {};
  const locationText = filters.locationText || areaText;
  const minRating = filters.minRating || null;
  const minReviews = filters.minReviews || null;
  const priceMin = Number.isFinite(filters.priceMin) ? filters.priceMin : null;
  const priceMax = Number.isFinite(filters.priceMax) ? filters.priceMax : null;
  const category = filters.category || "";
  const serviceText = filters.serviceText || "";

    function hasCoords(s) {
      return (
        (s.latitude !== undefined && s.longitude !== undefined) ||
        (s.lat !== undefined && s.lng !== undefined) ||
        (s.lat !== undefined && s.lon !== undefined)
      );
    }

    function getCoords(s) {
      if (s.latitude !== undefined && s.longitude !== undefined) return { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
      if (s.lat !== undefined && s.lng !== undefined) return { lat: parseFloat(s.lat), lng: parseFloat(s.lng) };
      if (s.lat !== undefined && s.lon !== undefined) return { lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
      return null;
    }

    // Haversine distance (km)
    function distanceKm(a, b) {
      const toRad = (v) => (v * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const sinDLat = Math.sin(dLat / 2);
      const sinDLon = Math.sin(dLon / 2);
      const aHarv = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
      return R * c;
    }

    if (coords) {
      // Separate services with coordinates and without
      const withCoords = relevantServices.filter((s) => hasCoords(s));
      const withoutCoords = relevantServices.filter((s) => !hasCoords(s));

      // Compute distances and filter by radius
      const within = [];
      const outside = [];
      for (const s of withCoords) {
        const sCoords = getCoords(s);
        if (!sCoords || Number.isNaN(sCoords.lat) || Number.isNaN(sCoords.lng)) {
          outside.push(s);
          continue;
        }
        const d = distanceKm(coords, sCoords);
        s._distanceKm = d;
        if (d <= radiusKm) within.push(s);
        else outside.push(s);
      }

      // Prefer services within radius; if none, allow some outside but rank them lower.
      relevantServices = [...within, ...withoutCoords, ...outside];
    } else if (locationText && typeof locationText === "string") {
      const qArea = locationText.toLowerCase();
      // Try a simple substring match on common location fields if present
      relevantServices = relevantServices.filter((s) => {
        return (
          (s.location || "").toLowerCase().includes(qArea) ||
          (s.city || "").toLowerCase().includes(qArea) ||
          (s.suburb || "").toLowerCase().includes(qArea) ||
          (s.postcode || "").toString().includes(qArea) ||
          (s.address || "").toLowerCase().includes(qArea)
        );
      });
      // If this filters out everything, fall back to original list
      if (relevantServices.length === 0) relevantServices = allServices.slice(0, 10);
    }

    const normalizedCategory = category ? category.toLowerCase() : "";
    const normalizedServiceText = serviceText ? serviceText.toLowerCase() : "";

    // Apply filter tabs if present
    if (normalizedCategory) {
      relevantServices = relevantServices.filter((s) =>
        (s.category || "").toLowerCase() === normalizedCategory
      );
    }

    if (normalizedServiceText) {
      relevantServices = relevantServices.filter((s) => {
        return (
          (s.name || "").toLowerCase().includes(normalizedServiceText) ||
          (s.description || "").toLowerCase().includes(normalizedServiceText) ||
          (s.service_list || "").toLowerCase().includes(normalizedServiceText)
        );
      });
    }

    if (minRating) {
      relevantServices = relevantServices.filter((s) =>
        (parseFloat(s.rating) || 0) >= minRating
      );
    }

    if (minReviews) {
      relevantServices = relevantServices.filter((s) =>
        (parseInt(s.reviews) || 0) >= minReviews
      );
    }

    function avgPrice(service) {
      if (!service.service_price) return null;
      const prices = String(service.service_price)
        .split(",")
        .map((p) => parseFloat(p.trim()))
        .filter((p) => !isNaN(p));
      if (prices.length === 0) return null;
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    }

    if (priceMin !== null || priceMax !== null) {
      relevantServices = relevantServices.filter((s) => {
        const price = avgPrice(s);
        if (price === null) return false;
        if (priceMin !== null && price < priceMin) return false;
        if (priceMax !== null && price > priceMax) return false;
        return true;
      });
    }

    // Rank services by a simple heuristic: rating, reviews and price (lower is better).
    // This is a light-weight in-backend ranking so that search results present multiple good options.
    const maxReviews = Math.max(...relevantServices.map((s) => s.reviews || 0), 1);

    relevantServices = relevantServices
      .map((s) => {
        const rating = parseFloat(s.rating) || 0;
        const reviews = parseInt(s.reviews) || 0;
        const price = avgPrice(s);
        // Normalize components
        const ratingScore = rating / 5; // 0..1
        const reviewsScore = Math.log(reviews + 1) / Math.log(maxReviews + 1 || 2); // 0..1
        let priceScore = 0.5; // neutral
        if (price !== null) {
          // cheaper is better: map price to 0..1 where lower price => higher score
          // to avoid extremes, clamp
          const clamped = Math.max(20, Math.min(price, 500));
          priceScore = 1 - (clamped - 20) / (500 - 20);
        }
        const composite = ratingScore * 0.6 + reviewsScore * 0.25 + priceScore * 0.15;
        return { service: s, score: composite };
      })
      .sort((a, b) => b.score - a.score)
      .map((p) => p.service)
      .slice(0, 5); // limit to top 5 recommendations

    // Post-process AI reasoning to avoid leaking numeric IDs: replace occurrences like "Service ID 5" with the service name
    let reasoning = aiResponse.reasoning || "";
    try {
      reasoning = reasoning.replace(/Service\s*ID\s*(\d+)/gi, (match, idStr) => {
        const idNum = parseInt(idStr, 10);
        const svc = allServices.find((s) => s.id === idNum);
        return svc ? svc.name : match;
      });
    } catch {
      // ignore replacement errors
    }

    return {
      type: aiResponse.type || "suggestions",
      services: relevantServices,
      reasoning: reasoning,
    };
  } catch (error) {
    console.error("Error in searchWithAI:", error);
    throw error;
  }
}

