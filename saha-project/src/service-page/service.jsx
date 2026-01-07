import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";
import Filter from "./filter.jsx";
import ServiceIcon from "./service-icon.jsx";
import Background from "../home-page/Background.jsx";

export default function Service() {
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
      <div className="relative z-10">
        <Filter />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full px-[2vw]"
          style={{
            gap: "clamp(5px, 0.75vw, 10px)",
            marginBottom: "clamp(40px, 6vw, 80px)",
          }}
        >
          {Array.from({ length: 16 }).map((_, index) => (
            <ServiceIcon key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
