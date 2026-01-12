import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import Background from "../home-page/Background.jsx";
import ServiceExpandHeader from "./service-expand-heading.jsx";
import AboutService from "./about-service.jsx";
import ServiceType from "./service-type.jsx";
import OtherServices from "./other-services.jsx";
import ServiceBook from "./service-book.jsx";
import Review from "./reviews.jsx";

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
            <OtherServices />
          </div>
        </div>
      </div>
    </div>
  );
}
