import Footer from "../home-page/Footer.jsx";
import Header from "../home-page/Header.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";

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
        className="w-full opacity-60 absolute inset-0"
      />
      <div className="relative z-10"></div>
    </div>
  );
}
