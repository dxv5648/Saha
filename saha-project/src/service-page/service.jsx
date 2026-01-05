import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";
import Filter from "./filter.jsx";
import ServiceIcon from "./service-icon.jsx";

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
        <img
            src={skyline}
            alt="Auckland skyline"
            className="w-full opacity-60 inset-0"
        />

        <div className="absolute inset-0 z-10 flex flex-col">
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
