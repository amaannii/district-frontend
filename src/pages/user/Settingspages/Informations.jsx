import React from "react";

function Informations() {
  return (
    <div className="play-regular text-white">

      {/* Page Title */}
      <h1 className="text-xl font-bold mb-15">
        Your information and permissions
      </h1>

      {/* Contact Info Row */}
      <div className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between transition cursor-pointer mb-5">
        <span className="text-gray-300 text-sm">
          Contact info
        </span>

        {/* Arrow */}
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

      {/* Birthday Row */}
      <div className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between transition cursor-pointer">
        <span className="text-gray-300 text-sm">
          Birthday
        </span>

        {/* Arrow */}
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

    </div>
  );
}

export default Informations;
