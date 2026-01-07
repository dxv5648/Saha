import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleScrollTo = (sectionId) => {
    if (location.pathname === "/" || location.pathname === "") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="bg-[#0F0F0F#0F0F0F] text-white w-full py-4 inter-regular">
      <div className="mx-[10%] flex justify-evenly items-center">
        <button
          onClick={() => handleScrollTo("about")}
          className="hover:text-gray-300"
        >
          About
        </button>

        <Link to="/Service" className="hover:text-gray-300">
          <button>Services</button>
        </Link>
        <Link to="/">
          <button className="text-4xl inter-semi-bold mx-[20%]">saha.</button>
        </Link>
        <button
          onClick={() => handleScrollTo("contact")}
          className="hover:text-gray-300"
        >
          Contact
        </button>
        {isLoggedIn ? (
          <Link to="/Profile" className="hover:text-gray-300">
            <button>Profile</button>
          </Link>
        ) : (
          <button onClick={handleLoginClick} className="hover:text-gray-300">
            Login
          </button>
        )}
      </div>
    </div>
  );
}
