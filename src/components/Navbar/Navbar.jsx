import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ icon, text, path, isOpen }) => {
  return (
    <Link to={path}>
      <ul className="flex items-center gap-8 cursor-pointer w-full hover:text-gray-300">
        <li className="transition-all duration-500 flex items-center gap-8 rounded">
          {icon}
          <span
            className={`transition-all duration-500 ${
              isOpen ? "block" : "hidden"
            } md:block`}
          >
            {text}
          </span>
        </li>
      </ul>
    </Link>
  );
};

export default Navbar;
