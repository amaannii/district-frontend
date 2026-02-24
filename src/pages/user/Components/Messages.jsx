import React, { useState } from "react";

import ksg from "../../../assets/images/Bekal Fort Kasargod.jpeg";
import knr from "../../../assets/images/Theyyam.jpeg";
import kzhd from "../../../assets/images/d60598646d40cbd774e5e4515aa3647f.jpg";
import idki from "../../../assets/images/4be085118ff742324c836f3726a690ca.jpg";
import ktym from "../../../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import wyd from "../../../assets/images/download (11).jpeg";
import mlpm from "../../../assets/images/kerala backwaters.jpeg";
import plkd from "../../../assets/images/Palakkad,Kerala (1).jpeg";
import tsr from "../../../assets/images/puthanpalli Thrissur.jpeg";
import alpzha from "../../../assets/images/Alappuzha.jpeg";
import kollm from "../../../assets/images/Kovalam.jpeg";
import pathmtta from "../../../assets/images/Pathanamthitta.jpeg";
import tvpm from "../../../assets/images/download (12).jpeg";
import ernklm from "../../../assets/images/fortkochi (1).jpeg";
import location from "../../../assets/images/icons8-location-24.png";
import ChatBox from "./ChatBox";

const images = [
  { src: ksg, title: "KASARGOD" },
  { src: knr, title: "KANNUR" },
  { src: ernklm, title: "ERNAKULAM" },
  { src: kzhd, title: "KOZHIKODE" },
  { src: idki, title: "IDUKKI" },
  { src: ktym, title: "KOTTAYAM" },
  { src: wyd, title: "WAYANAD" },
  { src: mlpm, title: "MALAPPURAM" },
  { src: plkd, title: "PALAKKAD" },
  { src: tsr, title: "THRISSUR" },
  { src: alpzha, title: "ALAPPUZHA" },
  { src: kollm, title: "KOVALAM" },
  { src: pathmtta, title: "PATHANAMTHITTA" },
  { src: tvpm, title: "THIRUVANANTHAPURAM" },
];

function Messages({ selectedDistrict, setSelectedDistrict }) {
  const [search, setSearch] = useState("");

  const filteredImages = images.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-black text-white">

      {/* Main Content */}
      <div className="flex-1 
                      px-4 sm:px-6 md:px-8 
                      pt-20 md:pt-6   /* space for mobile top bar */
                      pb-24 md:pb-6   /* space for mobile bottom nav */
                      overflow-y-auto">

        {/* Selected District Header */}
        {selectedDistrict && (
          <div className="flex items-center gap-4 mb-6">
            <img
              src={selectedDistrict.src}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              alt=""
            />
            <h2 className="text-lg sm:text-xl font-semibold">
              {selectedDistrict.title}
            </h2>
          </div>
        )}

        {/* District List View */}
        {!selectedDistrict && (
          <>
            <h1 className="text-xl sm:text-2xl font-bold mb-3">
              amani
            </h1>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-200 text-black outline-none"
            />

            <div className="flex items-center gap-2 mb-5">
              <img className="h-5" src={location} alt="location" />
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>

            {/* Responsive Grid */}
            <div className="
                grid 
                grid-cols-2 
                sm:grid-cols-3 
                lg:grid-cols-4 
                gap-4 sm:gap-6
                pb-6
              ">
              {filteredImages.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDistrict(item)}
                  className="relative 
                             h-32 sm:h-40 md:h-44 
                             rounded-xl 
                             overflow-hidden 
                             cursor-pointer 
                             group"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <h1 className="absolute bottom-2 left-2 text-[10px] sm:text-xs font-bold tracking-widest">
                    {item.title}
                  </h1>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Chat Section */}
        {selectedDistrict ? (
          <ChatBox
            district={selectedDistrict.title}
            onBack={() => setSelectedDistrict(null)}
          />
        ) : (
          <p className="text-gray-400 mt-4">Select a district</p>
        )}
      </div>
    </div>
  );
}

export default Messages;