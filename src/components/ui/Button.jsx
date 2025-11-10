import React from "react";

const Button = ({
  text,
  onClick,
  type = "button",
  color = "green",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "transition-all duration-300 font-semibold py-2 px-4 border rounded cursor-pointer";

  const colorClasses = {
    green:
      "text-green-500 hover:text-white border-green-500 hover:bg-green-500",
    red: "text-red-500 hover:text-white border-red-500 hover:bg-red-500",
    blue: "text-blue-500 hover:text-white border-blue-500 hover:bg-blue-500",
    gray: "text-gray-500 hover:text-white border-gray-500 hover:bg-gray-500",
  };
  const selectedColorClasses = colorClasses[color] || colorClasses.green;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${selectedColorClasses} 
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default Button;
