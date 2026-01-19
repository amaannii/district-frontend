import React from "react";
import Sidebar from "./Sidebar";

import post from "../assets/images/old car_.jpeg";
import heart from "../assets/images/icons8-heart-24.png";
import comment from "../assets/images/icons8-comment-50.png";
import send from "../assets/images/icons8-sent-50.png";
import bookmark from "../assets/images/icons8-bookmark-30.png";

import profile from "../assets/images/p1.jpg";
import profile1 from "../assets/images/download.jpeg";
import profile2 from "../assets/images/images.jpeg";
import profile3 from "../assets/images/images (1).jpeg";

function Home() {
  return (
    <div className="flex bg-black h-screen text-white">
      <Sidebar />

      {/* CENTER FEED */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col">

          {/* STORIES + NOTES */}
          <div className="h-[130px] flex items-center justify-between px-6 border-b border-neutral-800">
            {[
              { note: "Your note", plus: true, img: profile },
              { note: "next to fort kochi", img: profile1 },
              { note: "Low battery...", img: profile2 },
              { note: "hello bross", img: profile3 },
              { note: "vibing brb", img: profile },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center w-[80px]">
                <div className=" w-9 h-9 ">
                  {/* Rounded profile image */}
                  <div className="w-12 h-12 rounded-full bg-neutral-700 overflow-hidden mt-1">
                    {!item.plus && (
                      <img
                        src={item.img}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

    
                  
                </div>

                {/* NOTE TEXT */}
                {!item.plus ? (
                  <div className="mt-1 bg-white text-black text-[11px] px-3 py-1 rounded-full text-center leading-tight">
                    {item.note}
                  </div>
                ) : (
                  <span className="mt-4 mr-1 text-xs text-gray-300 text-center">  Your note</span>
                )}
              </div>
            ))}
          </div>

          {/* POST HEADER */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Profile avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={profile} alt="user" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-base">akshay__</span>
            </div>
            <span className="text-xl cursor-pointer">⋮</span>
          </div>

          {/* POST IMAGE */}
          <div className="w-full">
            <img
              src={post}
              alt="post"
              className="w-full max-h-[490px] object-cover rounded-md"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex gap-5 items-center">
              <img src={heart} alt="like" className="w-5 h-5" />
              <img src={comment} alt="comment" className="w-5 h-5" />
              <img src={send} alt="send" className="w-5 h-5" />
            </div>
            <img src={bookmark} alt="save" className="w-5 h-5" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
