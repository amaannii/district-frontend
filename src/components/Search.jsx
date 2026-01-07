import React from "react";
import logoo from "../assets/images/logoo.jpg";
import home from "../assets/images/icons8-home-24.png";
import search from "../assets/images/download search.png";

function Search() {
  return (
    <div className="h-screen w-full bg-black text-white flex play-regular ">

      {/* Sidebar */}
      <div className="w-[260px] border-r border-gray-800 p-6 flex flex-col">
       <div className="flex justify-center">
                     <img
                       src={logoo}
                       alt="DistriX"
                       className="w-[130px] object-contain h-[110px]"
                     />
                   </div>

        <div className="space-y-6 text-sm">
            <img src={home} alt="" />
          <Menu  text="HOME" />
          <img src={search} alt="" />
          <Menu text="SEARCH" />
          <Menu text="EXPLORE" />
          <Menu text="MESSAGES" />
          <Menu text="NOTIFICATION" />
          <Menu text="CREATE" />
          <Menu text="PROFILE" />
        </div>

        <div className="mt-auto">
          <Menu text="MORE" />
        </div>
      </div>

      {/* Search Panel */}
      <div className="w-[420px] border-r border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Search</h2>

        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-md text-black text-sm outline-none"
        />

        <div className="flex justify-between items-center mt-6 mb-4">
          <span className="text-sm text-gray-400">Recent</span>
          <span className="text-xs text-lime-500 cursor-pointer">
            Clear all
          </span>
        </div>

        <div className="space-y-4">
          {["Liam", "Feyo", "Yuva", "Kavi", "Liya"].map((name) => (
            <div
              key={name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600" />
                <div>
                  <p className="text-sm">{name}</p>
                  <p className="text-xs text-gray-500">
                    {name}.connected
                  </p>
                </div>
              </div>
              <span className="text-gray-500 cursor-pointer">×</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 flex flex-col items-center py-6">
        <div className="flex gap-5 mb-6">
          {["story_1", "vacation", "vibing"].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-600" />
              <span className="text-[10px] mt-1">{s}</span>
            </div>
          ))}
        </div>

        <div className="w-[420px]">
          <div className="h-[480px] bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">Post Image</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const Menu = ({ text }) => (
  <div className="cursor-pointer hover:text-lime-500 transition">
    {text}
  </div>
);

export default Search;
