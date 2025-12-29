import About from "./about.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import AI from "./ai-search.jsx";
import skyline from "../assets/Auckland-Skyline-Dark.jpg";
//import Login from "../login.jsx"

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
        className="w-full opacity-50 absolute inset-0"
      />
      <div className="relative z-10">
        <AI />
        <About />
      </div>
    </div>
  );
}
