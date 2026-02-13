import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import LoginModal from "../auth/LoginModal.jsx";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isAdminLoading, isAuthReady } = useAuth();
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
    <div className="bg-gradient-to-r from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] text-white w-full py-6 inter-regular border-b border-[#3a3a3a] shadow-lg">
      <div className="mx-[10%] flex justify-between items-center relative">
        <div className="flex gap-8">
          <Link
            to="/Service"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
          >
            <button className="text-base font-medium">Services</button>
          </Link>
          <button
            onClick={() => handleScrollTo("contact")}
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 font-medium"
          >
            Contact
          </button>
        </div>
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <button className="text-5xl inter-semi-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent hover:from-gray-100 hover:to-white transition-all duration-300">
            saha.
          </button>
        </Link>
        <div className="flex gap-8 items-center">
          {isAuthReady && !isAdminLoading && isAdmin && (
            <Link
              to="/admin"
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 font-medium"
            >
              <button>Admin</button>
            </Link>
          )}
          {!isAuthReady ? null : user ? (
            <Link
              to="/Profile"
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 font-medium"
            >
              <button>Profile</button>
            </Link>
          ) : (
            <button
              onClick={handleLoginClick}
              className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 font-medium"
            >
              Login
            </button>
          )}
          <Link
            to="/cart"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 font-medium"
          >
            <button>Cart</button>
          </Link>
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
