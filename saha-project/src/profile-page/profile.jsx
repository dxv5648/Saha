import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";
import ProfileHeader from "./profile-header.jsx";
import RecentServices from "./recent-services.jsx";
import FavouriteServices from "./favourite-services.jsx";
import PaymentMethods from "./payment-method.jsx";
import PersonalDetails from "./Personal-Details.jsx";

export default function Home() {
  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  return (
    <div className="w-full relative">
      <img
        src={skyline}
        alt="Auckland skyline"
        className="w-full opacity-60 inset-0"
      />

      <div className="absolute inset-0 z-10 flex flex-col">
        <ProfileHeader />

        {/* Three Column Layout */}
        <div className="flex gap-6 px-12 py-8">
          <div className="flex-1">
            <RecentServices />
          </div>
          <div className="flex-1">
            <PaymentMethods />
          </div>
        </div>

        {/* Favourite Services */}
        <div className="flex gap-6 px-12 py-8">
          <div className="flex-1">
            <FavouriteServices />
          </div>
          <div className="flex-1">
            <PersonalDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
