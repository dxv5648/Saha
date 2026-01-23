import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import LoginModal from "../auth/LoginModal.jsx";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
    setIsLoginOpen(true);
  };

  return (
    <div className="bg-[#0F0F0F#0F0F0F] text-white w-full py-4 inter-regular">
      <div className="mx-[10%] flex justify-evenly items-center">
        <Link to="/Service" className="hover:text-gray-300">
          <button>Services</button>
        </Link>
        <button
          onClick={() => handleScrollTo("contact")}
          className="hover:text-gray-300"
        >
          Contact
        </button>
        <Link to="/">
          <button className="text-4xl inter-semi-bold mx-[20%]">saha.</button>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/Profile" className="hover:text-gray-300">
              <button>Profile</button>
            </Link>
          </div>
        ) : (
          <button onClick={handleLoginClick} className="hover:text-gray-300">
            Login
          </button>
        )}
        <Link to="/cart" className="hover:text-gray-300">
          <button>Cart</button>
        </Link>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
