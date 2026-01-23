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
import ChatBox from "./Chatbox";

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
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="flex h-screen w-full bg-black text-white play-regular">
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          {selectedDistrict && (
            <div className="flex items-center gap-4 mb-6 animate-slideDown">
              <img
                src={selectedDistrict.src}
                className="w-14 h-14 rounded-full object-cover"
                alt=""
              />
              <h2 className="text-xl font-semibold">
                {selectedDistrict.title}
              </h2>
            </div>
          )}

          {/* Image Grid */}
          {!selectedDistrict && (
            <>
              <h1 className="text-2xl font-bold mb-1">john_jony</h1>

              {/* Search bar */}
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-200 text-black outline-none"
              />
              <div className="flex items-center gap-2 mb-5">
                <img className="h-5" src={location} alt="location" />
                <h2 className="text-lg font-semibold">Messages</h2>
              </div>

              <div className="grid grid-cols-3 gap-6 pb-10">
                {filteredImages.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDistrict(item)}
                    className="relative h-44 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <h1 className="absolute bottom-3 left-3 text-xs font-bold tracking-widest">
                      {item.title}
                    </h1>
                  </div>
                ))}
              </div>
            </>
          )}
        {selectedDistrict ? (
          <ChatBox
            district={selectedDistrict.title}
            onBack={() => setSelectedDistrict(null)}
          />
        ) : (
          <p className="text-gray-400">Select a district</p>
        )}
        </div>
      </div>
    </>
  );
}

export default Messages;
