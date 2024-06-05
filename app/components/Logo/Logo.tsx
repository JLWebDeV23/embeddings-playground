import React from "react";

const Logo = () => {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full transition-all duration-300 ease-in-out hover:border-green-500"></div>
      <div className="absolute right-0 bottom-1/4 flex items-center justify-center w-1/2 h-1/2">
        <span className="text-sm font-bold text-white">Joe.AI UI</span>
      </div>
    </div>
  );
};

export default Logo;
