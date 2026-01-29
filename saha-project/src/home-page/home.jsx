import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import About from "./about.jsx";
import Footer from "./footer.jsx";
import Header from "./header.jsx";
import AI from "./ai-search.jsx";
import ServiceOverview from "./service-overview.jsx";
import Contact from "./contact.jsx";
import Background from "./background.jsx";
import ServicePost from "../service-page/service-post/index.jsx";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <ServicePost />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  return (
    <div>
      <Background />
      <div className="relative z-10">
        <AI />
        <div id="about">
          <About />
        </div>
        <ServiceOverview />
        <div id="contact">
          <Contact />
        </div>
      </div>
    </div>
  );
}
