import React, { useState } from "react";
import post from "../../../assets/images/icons8-heart-24.png";
import heart from "../../../assets/images/icons8-heart-24.png";
import comment from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import profile from "../../../assets/images/p1.jpg";
import profile1 from "../../../assets/images/download.jpeg";
import profile2 from "../../../assets/images/images.jpeg";
import profile3 from "../../../assets/images/images (1).jpeg";
import MiniChatBox from "./MiniChatbox";

function Home({ openChat }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">

      {/* CENTER POSTS */}
      <div className="flex-1 max-w-2xl mx-auto">

        {/* STORIES */}
        <div className="h-[130px] flex items-center justify-between px-6 border-b border-neutral-800">
          {[
            { note: "Your note", plus: true, img: profile },
            { note: "@kochi", img: profile1 },
            { note: "Low", img: profile2 },
            { note: "hello bross", img: profile3 },
            { note: "vibing brb", img: profile },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center w-[80px]">
              <div className="w-12 h-12 rounded-full bg-neutral-700 overflow-hidden">
                {!item.plus && (
                  <img src={item.img} className="w-full h-full object-cover" />
                )}
              </div>
              {!item.plus ? (
                <div className="mt-1 bg-white text-black text-[11px] px-3 py-1 rounded-full">
                  {item.note}
                </div>
              ) : (
                <span className="mt-4 text-xs text-gray-300">
                  Your note
                </span>
              )}
            </div>
          ))}
        </div>

        {/* POST */}
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile} className="w-8 h-8 rounded-full" />
            <span className="font-semibold">akshay__</span>
          </div>
          <span className="text-xl">⋮</span>
        </div>

        <img src={post} className="w-full max-h-[450px] object-cover" />

        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex gap-5">
            <img
              src={heart}
              onClick={() => setLiked(!liked)}
              className={`w-5 h-5 cursor-pointer ${
                liked ? "filter hue-rotate-[330deg] saturate-200" : ""
              }`}
            />
            <img src={comment} className="w-5 h-5 cursor-pointer" />
            <img src={send} className="w-5 h-5 cursor-pointer" />
          </div>

          <img
            src={bookmark}
            onClick={() => setSaved(!saved)}
            className={`w-5 h-5 cursor-pointer ${
              saved ? "opacity-100" : "opacity-60"
            }`}
          />
        </div>
      </div>

      {/* RIGHT SIDE MINI MESSAGES */}
   
      <div className="w-[320px] hidden lg:block">
        <MiniChatBox openChat={openChat} />
      </div>

    </div>
  );
}

export default Home;
