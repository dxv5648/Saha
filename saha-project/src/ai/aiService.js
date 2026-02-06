import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "../supabase-client";
import { SYSTEM_PROMPT, getQueryPrompt } from "./prompts.js";

const SPAM_SYSTEM_PROMPT = `You are a content moderation assistant for a services marketplace.

Your job is to determine if a service listing submission is spam, scam, or low-quality, or if it looks like a genuine service.

Return ONLY valid JSON.

Flag as spam for:
- Cryptocurrency / investment / "get rich quick" schemes
- Adult content
- Hate/harassment
- Phishing, requesting passwords, suspicious links
- Obvious nonsense / keyword stuffing
- Repeated emojis or repeated characters
- Unreasonably generic "call me" with no service detail

Allow:
- Normal local trade services (plumbing, electrical, cleaning, etc.)

JSON format:
{
  "verdict": "ok" | "spam",
  "confidence": 0-1,
  "reasons": ["short bullet reason", "..."]
}`;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Use env override or default to gemini-2.0-flash (widely available, fast, no
// "thinking" overhead). No runtime model-discovery needed — one less network
// request that can fail with CORS / auth issues in the browser.
const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash").replace(/^models\//, "");

function resolveGeminiModelName() {
  return GEMINI_MODEL;
}

/**
 * Fetch all services from Supabase
 */
async function fetchAllServices() {
  try {
    const { data, error } = await supabase
      .from("Services")
      .select("*, locations(*)")
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
      location:
        service?.locations?.name ||
        service?.locations?.city ||
        service?.locations?.region ||
        service.location ||
        service.city ||
        service.suburb ||
        service.address ||
        "",
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
    // The GoogleGenerativeAI SDK often surfaces network issues as a generic
    // "Failed to fetch" error. Add context so it's debuggable.
    const apiKeyPresent = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

    console.error("Error in processQueryWithAI:", {
      message: error?.message,
      name: error?.name,
      model: GEMINI_MODEL,
      apiKeyPresent,
      cause: error?.cause,
      stack: error?.stack,
    });

    // Re-throw so the caller (searchWithAI) can handle graceful degradation.
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
    // If Gemini isn't configured, we can still provide value by falling back
    // to local keyword matching against the Supabase services list.
    const geminiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

    // Fetch all services from Supabase
    let allServices = [];
    try {
      allServices = await fetchAllServices();
    } catch (fetchErr) {
      console.error("Failed to fetch services from Supabase:", fetchErr);
      return {
        type: "suggestions",
        services: [],
        reasoning: "Could not reach the services database. Please try again shortly.",
      };
    }

    if (allServices.length === 0) {
      return {
        type: "suggestions",
        services: [],
        reasoning: "No services available in the database",
      };
    }

    // Process query with AI (optional)
    let aiResponse = { type: "suggestions", serviceIds: [] };
    if (geminiConfigured) {
      try {
        aiResponse = await processQueryWithAI(userQuery, allServices);
      } catch (aiErr) {
        // Graceful degradation: still return something useful (local fuzzy match)
        // so the app keeps working during demos and when API is down.
        console.warn("AI search unavailable, falling back to local match:", aiErr);
        aiResponse = { type: "suggestions", serviceIds: [] };
      }
    }

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

    // Keep a standard return shape expected by the UI (computed early so we can
    // safely fall back if the AI call failed or returned something unexpected).
    const resolvedType =
      aiResponse?.type === "comparison" ? "comparison" : "suggestions";
    const baseReasoning =
      relevantServiceIds.length > 0
        ? aiResponse?.reasoning || "Here are the best matches for your request."
        : "AI search is unavailable right now, so these are the closest keyword matches.";

    // NOTE: location filtering is applied below (existing code continues).

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
      // Prefer coords from joined locations table
      if (s?.locations?.latitude !== undefined && s?.locations?.longitude !== undefined) {
        return true;
      }
      return (
        (s.latitude !== undefined && s.longitude !== undefined) ||
        (s.lat !== undefined && s.lng !== undefined) ||
        (s.lat !== undefined && s.lon !== undefined)
      );
    }

    function getCoords(s) {
      if (s?.locations?.latitude !== undefined && s?.locations?.longitude !== undefined) {
        return {
          lat: parseFloat(s.locations.latitude),
          lng: parseFloat(s.locations.longitude),
        };
      }
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
      // Support common user input like: "Henderson, Auckland"
      // We split on commas and require ALL tokens to match somewhere in the service's location fields.
      const tokens = locationText
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const matchesLocationTokens = (s) => {
        const loc = s.locations || {};
        const haystack = [
          loc.name,
          loc.city,
          loc.region,
          loc.country,
          loc.postal_code,
          s.location,
          s.city,
          s.suburb,
          s.address,
          s.postcode,
        ]
          .map((v) => (v === null || v === undefined ? "" : String(v)))
          .join(" ")
          .toLowerCase();

        return tokens.every((tok) => haystack.includes(tok));
      };

      const before = relevantServices;
      relevantServices = relevantServices.filter(matchesLocationTokens);

      // IMPORTANT: don't fall back to unrelated services when the user explicitly
      // applies a location filter. If nothing matches, return zero results and
      // let the UI show "No services found".
      if (relevantServices.length === 0) {
        relevantServices = [];
      }
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

    if (relevantServices.length > 0) {
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
    }

    // Post-process reasoning to avoid leaking numeric IDs: replace occurrences like
    // "Service ID 5" with the service name.
    let finalReasoning = baseReasoning;
    try {
      finalReasoning = finalReasoning.replace(/Service\s*ID\s*(\d+)/gi, (match, idStr) => {
        const idNum = parseInt(idStr, 10);
        const svc = allServices.find((s) => s.id === idNum);
        return svc ? svc.name : match;
      });
    } catch {
      // ignore replacement errors
    }

    // Build a human-readable summary of all active filters so the reasoning
    // explains *why* the results were narrowed down.
    const appliedFilters = [];
    if (coords) {
      appliedFilters.push(`your current location (within ${radiusKm} km)`);
    }
    if (locationText) {
      appliedFilters.push(`location: "${locationText}"`);
    }
    if (normalizedCategory) {
      appliedFilters.push(`category: "${category}"`);
    }
    if (normalizedServiceText) {
      appliedFilters.push(`service keyword: "${serviceText}"`);
    }
    if (minRating) {
      appliedFilters.push(`minimum rating: ${minRating}★`);
    }
    if (minReviews) {
      appliedFilters.push(`minimum reviews: ${minReviews}`);
    }
    if (priceMin !== null && priceMax !== null) {
      appliedFilters.push(`price range: $${priceMin}–$${priceMax}`);
    } else if (priceMin !== null) {
      appliedFilters.push(`minimum price: $${priceMin}`);
    } else if (priceMax !== null) {
      appliedFilters.push(`maximum price: $${priceMax}`);
    }

    if (appliedFilters.length > 0) {
      const filterSummary = appliedFilters.join(", ");
      if (relevantServices.length > 0) {
        finalReasoning += ` Results were filtered by ${filterSummary}.`;
      } else {
        finalReasoning = `No services matched your filters (${filterSummary}). Try broadening your search or clearing some filters.`;
      }
    } else if (relevantServices.length === 0) {
      finalReasoning = "No services matched your search. Try different keywords or clearing your filters.";
    }

    return {
      type: resolvedType,
      services: relevantServices,
      reasoning: finalReasoning,
    };
  } catch (error) {
    console.error("Error in searchWithAI:", error);
    // Never let a network/runtime error bubble up – always return a usable result.
    return {
      type: "suggestions",
      services: [],
      reasoning: "Something went wrong while searching. Please try again.",
    };
  }
}

/**
 * AI spam check for service submissions.
 * @param {{name:string, provider:string, category:string, description:string, locationText?:string, services?:Array<{service_list?:string, service_price?:string}>}} input
 * @returns {Promise<{verdict:"ok"|"spam", confidence:number, reasons:string[]}>}
 */
export async function checkServicePostForSpam(input) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    // If AI isn't configured, fail open (don't block posting)
    return { verdict: "ok", confidence: 0, reasons: ["AI not configured"] };
  }

  const modelName = await resolveGeminiModelName();
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `${SPAM_SYSTEM_PROMPT}\n\nSubmission:\n${JSON.stringify(
    {
      name: input?.name || "",
      provider: input?.provider || "",
      category: input?.category || "",
      description: input?.description || "",
      locationText: input?.locationText || "",
      services: Array.isArray(input?.services) ? input.services : [],
    },
    null,
    2,
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(text);
    const verdict = parsed?.verdict === "spam" ? "spam" : "ok";
    const confidenceRaw = Number(parsed?.confidence);
    const confidence = Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(1, confidenceRaw))
      : 0.5;
    const reasons = Array.isArray(parsed?.reasons)
      ? parsed.reasons.map(String).filter(Boolean).slice(0, 5)
      : [];
    return { verdict, confidence, reasons };
  } catch {
    // If AI returns something unexpected, fail open but record a reason.
    return { verdict: "ok", confidence: 0.25, reasons: ["AI parse fallback"] };
  }
}

