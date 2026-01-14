import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";
import ServiceExpandHeader from "./service-expand-heading.jsx";
import AboutService from "./about-service.jsx";
import ServiceType from "./service-type.jsx";
import OtherServices from "./other-services.jsx";
import ServiceBook from "./service-book.jsx";
import Review from "./reviews.jsx";
import supabase from "../supabase-client";

export default function Profile() {
  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  const { serviceId } = useParams();
  const [supabaseServices, setSupabaseServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("Services")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching services:", error);
        } else {
          // Transform Supabase data to match expected format
          const transformedServices = data.map((service) => {
            // Calculate priceRange from service_price if available
            let priceRange = "$50-100/hr"; // default
            if (service.service_price) {
              const prices = service.service_price.split(",").map((p) => parseFloat(p.trim())).filter((p) => !isNaN(p));
              if (prices.length > 0) {
                const minPrice = Math.round(Math.min(...prices));
                const maxPrice = Math.round(Math.max(...prices));
                priceRange = minPrice === maxPrice 
                  ? `$${minPrice}/hr` 
                  : `$${minPrice}-${maxPrice}/hr`;
              }
            }
            
            return {
              id: service.id,
              name: service.name,
              provider: service.provider,
              category: service.category,
              rating: service.rating || 4.5,
              reviews: service.reviews || 100,
              priceRange: priceRange,
              description: service.description,
              service_list: service.service_list,
              service_price: service.service_price,
            };
          });
          setSupabaseServices(transformedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Use only Supabase services
  const allServices = supabaseServices;

  // Find service by ID
  const currentService = allServices.find((s) => {
    // Try exact match first
    if (String(s.id) === String(serviceId)) return true;
    // Try parsing as integer if both are numeric
    if (!isNaN(serviceId) && !isNaN(s.id) && s.id === parseInt(serviceId)) return true;
    return false;
  });

  if (loading) {
    return (
      <div className="w-full relative">
        <Background />
        <div className="relative inset-0 z-10 flex justify-center items-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="w-full relative">
        <Background />
        <div className="relative inset-0 z-10 flex justify-center items-center min-h-screen">
          <div className="text-white text-xl">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Background />

      <div className="relative inset-0 z-10 flex flex-col">
        <div className="flex justify-center">
          <ServiceExpandHeader />
        </div>
        <div className="flex justify-center px-4">
          <div className="w-full max-w-300 flex flex-col">
            <AboutService 
              serviceName={currentService.name}
              description={currentService.description}
            />
            <ServiceType 
              serviceList={currentService.service_list}
              servicePrice={currentService.service_price}
            />
          </div>
        </div>
        <div className="flex justify-center px-4 mt-8">
          <div className="w-full max-w-300 flex gap-8">
            <div className="flex-1">
              <Review />
            </div>
            <div className="w-96">
              <ServiceBook />
            </div>
          </div>
        </div>
        <div className="flex justify-center px-4 mt-8 mb-12">
          <div className="w-full max-w-300 flex flex-col">
            <OtherServices
              currentServiceId={currentService?.id}
              currentCategory={currentService?.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
