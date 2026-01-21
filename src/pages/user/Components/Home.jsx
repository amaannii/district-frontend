import React  from 'react'
import post from "../../../assets/images/icons8-heart-24.png";
import heart from "../../../assets/images/icons8-heart-24.png";
import comment from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import profile from "../../../assets/images/p1.jpg";
import profile1 from "../../../assets/images/download.jpeg";
import profile2 from "../../../assets/images/images.jpeg";
import profile3 from "../../../assets/images/images (1).jpeg";
import { useState } from "react";

function Home() {
    const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPostView, setShowPostView] = useState(false);
   const [showAccount, setShowAccount] = useState(false);

  const postData = {
    id: 1,
    image: post,
    username: "akshay__",
    profileImg: profile,
    posts: [post, post, post],
  };

  const handleLike = () => setLiked(!liked);

  const handleSave = () => {
    setSaved(!saved);
  };
  return (
    <>
     <div className="w-full max-w-2xl flex flex-col">

          {/* STORIES */}
          <div className="h-[130px] flex items-center justify-between px-6 border-b border-neutral-800">
            {[
              { note: "Your note", plus: true, img: profile },
              { note: "@kochi", img: profile1 },
              { note: "Low ", img: profile2 },
              { note: "hello bross", img: profile3 },
              { note: "vibing brb", img: profile },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center w-[80px]">
                <div className="w-12 h-12 rounded-full bg-neutral-700 overflow-hidden">
                  {!item.plus && (
                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                {!item.plus ? (
                  <div className="mt-1 bg-white text-black text-[11px] px-3 py-1 rounded-full">
                    {item.note}
                  </div>
                ) : (
                  <span className="mt-4 text-xs text-gray-300">Your note</span>
                )}
              </div>
            ))}
          </div>

          {/* POST HEADER */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={profile} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold">akshay__</span>
            </div>
            <span className="text-xl">⋮</span>
          </div>

          {/* POST IMAGE */}
          <img src={post} alt="" className="w-full max-h-[450px] object-cover" />

          {/* ACTIONS */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex gap-5 items-center">
              {/* ❤️ LIKE */}
              <img
                src={heart}
                alt="like"
                onClick={handleLike}
                className={`w-5 h-5 cursor-pointer transition ${
                  liked ? "filter hue-rotate-[330deg] saturate-200" : ""
                }`}
              />

              {/* 💬 COMMENT */}
              <img
                src={comment}
                alt="comment"
                className="w-5 h-5 cursor-pointer"
              />

              {/* ✈️ SHARE */}
              <img
                src={send}
                alt="send"
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {/* 🔖 SAVE */}
            <img
              src={bookmark}
              alt="save"
              onClick={handleSave}
              className={`w-5 h-5 cursor-pointer ${
                saved ? "opacity-100" : "opacity-60"
              }`}
            />
          </div>

        </div>

    </>
  )
}

export default Home