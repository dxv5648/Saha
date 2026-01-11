import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";
import ProfileHeader from "./profile-header.jsx";
import RecentServices from "./recent-services.jsx";
import FavouriteServices from "./favourite-services.jsx";
import PaymentMethods from "./payment-method.jsx";
import PersonalDetails from "./Personal-Details.jsx";
import Background from "../home-page/Background.jsx";

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
  return (
    <div className="w-full relative">
      <Background />

      <div className="relative inset-0 z-10 flex flex-col">
        <ProfileHeader />

        <div className="flex flex-col lg:flex-row gap-6 px-12 py-8">
          <div className="flex-1">
            <RecentServices />
          </div>
          <div className="flex-1">
            <PaymentMethods />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 px-12 py-8">
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
