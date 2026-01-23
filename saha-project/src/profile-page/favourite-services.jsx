import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import WorkImage from "../assets/Work-imgae.png";

export default function FavouriteServices() {
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteServices = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, fetch favorites for the user
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("Favorite")
          .select("id, service_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          setFavoriteServices([]);
          setLoading(false);
          return;
        }

        if (!favoritesData || favoritesData.length === 0) {
          setFavoriteServices([]);
          setLoading(false);
          return;
        }

        // Fetch service details separately
        const serviceIds = favoritesData
          .map((fav) => fav.service_id)
          .filter(Boolean);

        if (serviceIds.length === 0) {
          setFavoriteServices([]);
          setLoading(false);
          return;
        }

        const { data: servicesData, error: servicesError } = await supabase
          .from("Services")
          .select("id, provider")
          .in("id", serviceIds);

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          setFavoriteServices([]);
        } else if (servicesData) {
          // Transform data to match UI format
          const services = servicesData.map((service) => ({
            id: service.id,
            provider: service.provider,
            image: WorkImage, // Use fallback image since Services table doesn't have image column
          }));
          setFavoriteServices(services);
        }
      } catch (error) {
        console.error("Unexpected error fetching favorites:", error);
        setFavoriteServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteServices();
  }, [user]);

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div
      className="flex flex-col items-center bg-[#161616F0] rounded-[40px] w-full inter-regular"
      style={{ padding: "clamp(20px, 3vw, 24px)" }}
    >
      <span
        className="text-white mb-9.75 poppins-bold"
        style={{
          fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
          marginTop: "clamp(20px, 3vw, 42px)",
        }}
      >
        {"Favourite Services"}
      </span>
      {loading ? (
        <div className="text-center py-8">
          <span className="text-[#D1D1D1] text-sm">Loading...</span>
        </div>
      ) : favoriteServices.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-[#D1D1D1] text-sm">
            No favorite services yet. Add services to your favorites to see them here.
          </span>
        </div>
      ) : (
        <div
          className="flex flex-col sm:flex-row items-start w-full justify-center mb-15.25 flex-wrap"
          style={{ gap: "clamp(15px, 2.5vw, 20px)" }}
        >
          {favoriteServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-start bg-[#121212B0] rounded-[30px] border border-solid border-[#BABABA] w-full sm:w-auto cursor-pointer hover:border-white transition-colors"
              style={{ paddingBottom: "clamp(8px, 1.5vw, 10px)" }}
              onClick={() => handleServiceClick(service.id)}
            >
              <img
                src={service.image}
                alt={service.provider}
                className="w-full object-cover rounded-t-[30px]"
                style={{
                  height: "clamp(180px, 25vw, 231px)",
                  marginBottom: "clamp(8px, 1.5vw, 10px)",
                }}
              />
              <span
                className="text-white"
                style={{
                  fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                  marginLeft: "clamp(15px, 2vw, 21px)",
                }}
              >
                By {service.provider}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
