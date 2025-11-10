import React, { useState } from "react";
import Minilogo from "../../assets/images/minilogo.png";
import Logo from "../../assets/images/iett-logo-white.png";
import { MenuItems } from "../../data/menuitems";
import Navbar from "../Navbar/Navbar";
import { IoMenuSharp } from "react-icons/io5";
import { RiArrowLeftSLine } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, SetIsOpen] = useState(false);
  return (
    <div
      className={`bg-gradient-to-t from-blue-800 via-red-600 to-red-900 text-white h-full flex flex-col items-center gap-10 transition-all duration-500 fixed top-0 left-0 z-10 ${
        isOpen ? "w-[240px]" : "w-[80px]"
      } md:w-[240px] shadow-xl`}
    >
      <div className="img cursor-pointer mt-5">
        <img
          src={Minilogo}
          alt="Logo"
          className="h-14 w-14 object-fill transition-all duration-300 block md:hidden"
        />

        <img
          src={Logo}
          alt="Logo"
          className="transition-all duration-300 hidden md:block w-44 h-auto object-cover"
        />
      </div>
      <nav className="flex flex-col gap-5 mt-4 justify-center">
        {MenuItems.map(
          (item, index) =>
            item && (
              <Navbar
                key={index}
                icon={item.icon}
                text={item.text}
                path={item.path}
                isOpen={isOpen}
              />
            )
        )}
      </nav>
      <div className="bg-white/25 h-8 w-8 rounded-full relative">
        <button
          className="cursor-pointer font-bold z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={() => SetIsOpen((prev) => !prev)}
        >
          <RiArrowLeftSLine
            size={"28px"}
            className={`transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
