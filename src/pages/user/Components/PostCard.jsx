import React, { useState } from 'react'

import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import comment from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

/* ---------------- POST CARD ---------------- */

function PostCard({ data, onShare, onOpenOptions }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");  
  const [comments, setComments] = useState([]);

  return (
    <div className="border-b border-neutral-800 mb-6  ">
        <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">

          {/* PROFILE IMAGE */}
          <img
            src={data.userId.img}
            className="w-8 h-8 rounded-full object-cover"
          />

          {/* USERNAME */}
          <span className="font-semibold">
            {data.userId.username}
          </span>
        </div>
      </div>

      {/* POST IMAGE */}
      <img
        src={data.image}
        className="w-full max-h-[430px] object-cover"
      />

      {/* CAPTION */}
      <p className="px-6 py-2 text-gray-300">
        {data.caption}
      </p>

      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex items-center gap-1">
            <img
              src={liked ? heartRed : heart}
              className="w-5 cursor-pointer"
              onClick={() => {
                setLiked(!liked);
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
              }}
            />
            <span className="text-xs text-gray-400">{likeCount}</span>
          </div>

          <img
            src={comment}
            className="w-5 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          />

          <img
            src={send}
            className="w-5 cursor-pointer"
            onClick={() => onShare(data)}
          />
        </div>

        <img
          src={bookmark}
          className={`w-5 cursor-pointer ${saved ? "" : "opacity-50"}`}
          onClick={() => setSaved(!saved)}
        />
      </div>

      {showComments && (
        <div className="px-6 pb-4">
          {comments.map((c, i) => (
            <p key={i} className="text-sm text-gray-300">
              {c}
            </p>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-neutral-800 p-2 rounded"
              placeholder="Add a comment..."
            />
            <button
              onClick={() => {
                if (!commentText.trim()) return;
                setComments([...comments, commentText]);
                setCommentText("");
              }}
              className="text-blue-500"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard