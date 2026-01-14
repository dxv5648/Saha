import { useParams } from "react-router-dom";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";
import ServiceExpandHeader from "./service-expand-heading.jsx";
import AboutService from "./about-service.jsx";
import ServiceType from "./service-type.jsx";
import OtherServices from "./other-services.jsx";
import ServiceBook from "./service-book.jsx";
import Review from "./reviews.jsx";
import { SERVICES_DATA } from "../service-page/service-db-temp.jsx";

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
  const currentService = SERVICES_DATA.find(
    (s) => s.id === parseInt(serviceId)
  );

  return (
    <div className="w-full relative">
      <Background />

      <div className="relative inset-0 z-10 flex flex-col">
        <div className="flex justify-center">
          <ServiceExpandHeader />
        </div>
        <div className="flex justify-center px-4">
          <div className="w-full max-w-300 flex flex-col">
            <AboutService />
            <ServiceType />
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
              currentServiceId={parseInt(serviceId)}
              currentCategory={currentService?.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
