import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-[#0F0F0F] text-white w-full py-4 font-inter">
      <div className="mx-[10%] flex justify-evenly items-center">
        <Link to="/Testing" className="hover:text-gray-300">
          <button>About</button>
        </Link>

        <button>Services</button>
        <button className="text-4xl font-bold mx-[20%]">saha.</button>
        <button>Contact</button>
        <button>Login</button>
      </div>
    </div>
  );
}
