import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (sectionId) => {
    if (location.pathname === "/" || location.pathname === "") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <div className="bg-[#0F0F0F] text-[#BABABA] inter-regular text-sm py-8 px-8 text-center mt-auto">
      <Link to="/" className="hover:text-white">
        Saha
      </Link>{" "}
      | <button className="hover:text-white">Login</button> |{" "}
      <Link to="/Service" className="hover:text-white">
        Services
      </Link>{" "}
      |{" "}
      <button
        onClick={() => handleScrollTo("about")}
        className="hover:text-white"
      >
        About
      </button>{" "}
      |{" "}
      <button
        onClick={() => handleScrollTo("contact")}
        className="hover:text-white"
      >
        Contact
      </button>
      <br />
      Copyright ©2025 Saha Interactive. Terms of Use, Privacy Policy and Your
      Regional Privacy Rights apply to this site.
      <br />
      <br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
  );
}
