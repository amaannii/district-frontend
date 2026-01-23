import React, { useState } from "react";

import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import comment from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

import profile from "../../../assets/images/p1.jpg";
import profile1 from "../../../assets/images/download.jpeg";
import post from "../../../assets/images/download (13).jpeg";
import profile2 from "../../../assets/images/images.jpeg";
import profile3 from "../../../assets/images/images (1).jpeg";
import profile4 from "../../../assets/images/Veste Tapisserie Roxane 29 - Marine Guillemette.jpeg";

import MiniChatBox from "./MiniChatbox";

function Home({ openChat }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const [likeCount, setLikeCount] = useState(128);
  const [commentCount, setCommentCount] = useState(34);
  const [shareCount, setShareCount] = useState(12);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  /* NOTE LOGIC */
  const [myNote, setMyNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      <div className="flex-1 max-w-2xl mx-auto">

        {/* STORIES */}
        <div className="h-[130px] flex items-center justify-between px-6 border-b border-neutral-800">

          {/* YOUR NOTE (UI SAME) */}
          <div className="flex flex-col items-center w-[80px]">
            <div className="relative w-13 h-13 rounded-full bg-neutral-700 overflow-hidden">
              <img src={profile1} className="w-full h-full object-cover" />

              {!myNote && (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="absolute bottom-0 right-0 h-[18px] w-[18px] rounded-full bg-blue-900 text-xs flex items-center justify-center"
                >
                  +
                </button>
              )}
            </div>

            {myNote && (
              <div
                onClick={() => {
                  if (window.confirm("Delete note?")) setMyNote("");
                }}
                className="bg-white text-black text-[11px] px-3 py-1 rounded-full mt-1 cursor-pointer"
              >
                {myNote}
              </div>
            )}
          </div>

          {/* OTHER NOTES */}
          {[
            { note: "@kochi", img: profile4 },
            { note: "Low", img: profile2 },
            { note: "hello bross", img: profile3 },
            { note: "vibing brb", img: profile },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center w-[80px]">
              <div className="w-13 h-13 rounded-full bg-neutral-700 overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover" />
              </div>
              <div className="bg-white text-black text-[11px] px-3 py-1 rounded-full mt-1">
                {item.note}
              </div>
            </div>
          ))}
        </div>

        {/* NOTE INPUT (NO UI CHANGE) */}
        {showNoteInput && (
          <div className="px-6 pt-2">
            <input
              autoFocus
              maxLength={60}
              className="w-full bg-neutral-800 text-sm p-2 rounded outline-none"
              placeholder="Add a note..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  setMyNote(e.target.value);
                  setShowNoteInput(false);
                }
              }}
            />
          </div>
        )}

        {/* POST HEADER */}
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile} className="w-8 h-8 rounded-full" />
            <span className="font-semibold">akshay__</span>
          </div>
          <span className="text-xl">⋮</span>
        </div>

        {/* POST IMAGE */}
        <img className="w-full max-h-[430px] object-cover" src={post} />

        {/* ACTIONS */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex gap-5 items-center">

            {/* LIKE */}
            <div className="flex items-center gap-1">
              <img
                src={liked ? heartRed : heart}
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                }}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-xs text-gray-400">{likeCount}</span>
            </div>

            {/* COMMENT */}
            <div className="flex items-center gap-1">
              <img
                src={comment}
                onClick={() => setShowCommentBox(!showCommentBox)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-xs text-gray-400">{commentCount}</span>
            </div>

            {/* SHARE */}
            <div className="flex items-center gap-1">
              <img
                src={send}
                onClick={() => {
                  setShareCount(shareCount + 1);
                  openChat(true);
                }}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-xs text-gray-400">{shareCount}</span>
            </div>
          </div>

          {/* SAVE */}
          <img
            src={bookmark}
            onClick={() => setSaved(!saved)}
            className={`w-5 h-5 cursor-pointer ${
              saved ? "opacity-100" : "opacity-60"
            }`}
          />
        </div>

        {/* COMMENTS */}
        {showCommentBox && (
          <div className="px-6 pb-4">
            {comments.map((c, i) => (
              <p key={i} className="text-sm text-gray-300 mb-1">
                <span className="font-semibold mr-1">you</span>
                {c}
              </p>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-neutral-800 text-sm p-2 rounded outline-none"
              />
              <button
                onClick={() => {
                  if (!commentText.trim()) return;
                  setComments([...comments, commentText]);
                  setCommentCount(commentCount + 1);
                  setCommentText("");
                }}
                className="text-blue-500 text-sm font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT CHAT */}
      <div className="w-[320px] hidden lg:block">
        <MiniChatBox openChat={openChat} />
      </div>
    </div>
  );
}

export default Home;
