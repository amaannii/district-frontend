import React, { useState } from "react";
import Sidebar from "./Sidebar";

import post from "../assets/images/Jew street.jpeg";
import heart from "../assets/images/icons8-heart-24.png";
import comment from "../assets/images/icons8-comment-50.png";
import send from "../assets/images/icons8-sent-50.png";
import bookmark from "../assets/images/icons8-bookmark-30.png";

import profile from "../assets/images/p1.jpg";
import profilem from "../assets/images/pexels-doquyen-1520760.jpg";
import profile1 from "../assets/images/download.jpeg";
import profile2 from "../assets/images/images.jpeg";
import profile3 from "../assets/images/images (1).jpeg";

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
    <div className="flex bg-black h-screen text-white play-regular relative">
      <Sidebar />

      {/* ================= FEED ================= */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col">

          {/* STORIES */}
          <div className="h-[130px] flex items-center justify-between px-6 border-b border-neutral-800">
            {[
              { note: "Your note", img: profile1 },
              { note: "@kochi", img: profilem },
              { note: "Low", img: profile2 },
              { note: "hello bross", img: profile3 },
              { note: "vibing brb", img: profile },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center w-[80px]">
                <div className="w-12 h-12 rounded-full bg-neutral-700 overflow-hidden">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-1 bg-white text-black text-[11px] px-3 py-1 rounded-full">
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* POST HEADER */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <img
                src={profile}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">akshay__</span>
            </div>

            {/* ⋮ BUTTON */}
            <span
              className="text-xl cursor-pointer"
              onClick={() => setShowPostView(true)}
            >
              ⋮
            </span>
          </div>

          {/* POST IMAGE */}
          <img
            src={post}
            alt=""
            className="w-full max-h-[450px] object-cover"
          />

          {/* ACTIONS */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex gap-5 items-center">
              <img
                src={heart}
                alt=""
                onClick={handleLike}
                className={`w-5 h-5 cursor-pointer ${
                  liked ? "filter hue-rotate-[330deg] saturate-200" : ""
                }`}
              />
              <img src={comment} alt="" className="w-5 h-5 cursor-pointer" />
              <img src={send} alt="" className="w-5 h-5 cursor-pointer" />
            </div>

            <img
              src={bookmark}
              alt=""
              onClick={handleSave}
              className={`w-5 h-5 cursor-pointer ${
                saved ? "opacity-100" : "opacity-50"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ================= FULL POST VIEW OVERLAY ================= */}
      {showPostView && (
        <div className="absolute inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-black max-w-3xl w-full flex rounded-md overflow-hidden relative">

            {/* CLOSE */}
            <span
              className="absolute top-3 right-4 text-2xl cursor-pointer"
              onClick={() => setShowPostView(false)}
            >
              ✕
            </span>

            {/* IMAGE */}
            <div className="flex-1">
              <img
                src={postData.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT PANEL */}
            <div className="w-[350px] border-l border-neutral-800 p-4 flex flex-col">

              {/* USER */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={postData.profileImg}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold">{postData.username}</span>
              </div>

              {/* PLACEHOLDER COMMENTS */}
              <div className="flex-1 text-gray-400 text-sm">
                No comments yet
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <img src={heart} className="w-5 h-5 cursor-pointer" />
                  <img src={comment} className="w-5 h-5 cursor-pointer" />
                  <img src={send} className="w-5 h-5 cursor-pointer" />
                </div>
                <img src={bookmark} className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
