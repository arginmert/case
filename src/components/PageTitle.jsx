import React from "react";
import { GoKebabHorizontal } from "react-icons/go";

const PageTitle = ({ title }) => {
  return (
    <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">{title || "Başlık Yok"}</h2>
      <GoKebabHorizontal size={"1.2rem"} className="rotate-90 cursor-pointer" />
    </div>
  );
};

export default PageTitle;
