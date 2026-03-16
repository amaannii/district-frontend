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
// import location from "../../../assets/images/icons8-location-24.png";
// import searchIcon from "../../../assets/images/icons8-search-50.png";
import ChatBox from "./ChatBox";
import { useEffect } from "react";
import axios from "axios";
import API from "../../../API/Api";

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
  { src: kollm, title: "KOLLAM" },
  { src: pathmtta, title: "PATHANAMTHITTA" },
  { src: tvpm, title: "THIRUVANANTHAPURAM" },
];

function Messages({ selectedDistrict, setSelectedDistrict, setSelectedUsername, setActive }) {
  const [search, setSearch] = useState("");
  const [userdetails, setuserdetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const token = localStorage.getItem("userToken");
   
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await API.post(
        "/user/userdetails",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const user = response.data.user;
      setuserdetails(user);
      localStorage.setItem("userId", user._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen w-full bg-gradient-to-b from-black to-neutral-900 text-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#879F00]/30 scrollbar-track-transparent sm:px-6 md:px-8 pt-4 sm:pt-6 md:pb-6">
        
        {/* Selected District Header */}
        {selectedDistrict && (
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm  sm:-mx-6 md:-mx-8 px-3 sm:px-6 md:px-8 py-3 sm:py-4 mb-4 border-b border-neutral-800/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSelectedDistrict(null)}
                className="lg:hidden w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-[#879F00]/50 overflow-hidden">
                  <img
                    src={selectedDistrict.src}
                    className="w-full h-full object-cover"
                    alt={selectedDistrict.title}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                  {selectedDistrict.title}
                  <span className="text-xs bg-[#879F00]/20 text-[#879F00] px-2 py-0.5 rounded-full">
                    District
                  </span>
                </h2>
                <p className="text-xs text-gray-400">Chat with people from {selectedDistrict.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* District List View */}
        {!selectedDistrict && (
          <>
            {/* Welcome Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Welcome back,
              </h1>
              <p className="text-lg sm:text-xl text-[#879F00] mt-1">
                {userdetails.username}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5 sm:mb-6">
              <input
                type="text"
                placeholder="Search district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#879F00] transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Messages Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-full bg-[#879F00]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#879F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold">District Chats</h2>
              <span className="text-xs text-gray-500 ml-auto">
                {filteredImages.length} districts
              </span>
            </div>

            {/* Responsive Grid */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pb-6">
                {filteredImages.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDistrict(item)}
                    onMouseEnter={() => setHoveredDistrict(item.title)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    {/* Image */}
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-2 sm:p-3 flex flex-col justify-end">
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-1 drop-shadow-lg">
                        {item.title}
                      </h3>
                      
                      {/* Stats */}
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-[#879F00]/20 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredDistrict === item.title ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button className="bg-white text-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transform hover:scale-105 transition-transform">
                        Join Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm sm:text-base mb-2">No districts found</p>
                <p className="text-gray-600 text-xs sm:text-sm">Try searching with a different name</p>
              </div>
            )}
          </>
        )}

        {/* Chat Section */}
        {selectedDistrict && (
          <div className="animate-fadeIn">
            <ChatBox
              district={selectedDistrict.title}
              onBack={() => setSelectedDistrict(null)}
              setSelectedUsername={setSelectedUsername}
              setActive={setActive}
            />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="chaotic-orbit"></div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(135, 159, 0, 0.3);
          border-radius: 20px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(135, 159, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

export default Messages;