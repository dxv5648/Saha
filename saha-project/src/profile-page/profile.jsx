import { useState } from "react";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import ProfileHeader from "./profile-header.jsx";
import RecentServices from "./recent-services.jsx";
import MyBookings from "./my-bookings.jsx";
import FavouriteServices from "./favourite-services.jsx";
import PaymentMethods from "./payment-method.jsx";
import PersonalDetails from "./Personal-Details.jsx";
import Background from "../home-page/background.jsx";

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
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full relative">
      <Background />

      <div className="relative inset-0 z-10 flex flex-col">
        <ProfileHeader />

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 mt-4 mb-8">
          <div className="flex gap-4 bg-[#161616F0] rounded-[30px] p-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "bookings", label: "My Bookings" },
              { id: "favorites", label: "Favorites" },
              { id: "payment", label: "Payment" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-[20px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-[#D1D1D1] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              <div className="h-full">
                <RecentServices />
              </div>
              <div className="h-full">
                <PaymentMethods />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              <div className="h-full">
                <FavouriteServices />
              </div>
              <div className="h-full">
                <PersonalDetails />
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="flex justify-center px-4 pb-12">
            <div className="w-full max-w-4xl">
              <MyBookings />
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div className="flex justify-center px-4 pb-12">
            <div className="w-full max-w-4xl">
              <FavouriteServices />
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="flex justify-center px-4 pb-12">
            <div className="w-full max-w-4xl">
              <PaymentMethods />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="flex justify-center px-4 pb-12">
            <div className="w-full max-w-4xl">
              <PersonalDetails />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
