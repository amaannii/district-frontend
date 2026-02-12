import React, { useState } from "react";
import axios from "axios";

import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

function PostCard({ data, onShare }) {
  const token = localStorage.getItem("token");

  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(data.isLiked || false);
  const [likeCount, setLikeCount] = useState(data.likes || 0);
  const [comments, setComments] = useState(data.comments || []);

  /* ❤️ LIKE */
  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLiked(res.data.isLiked);
        setLikeCount(res.data.likes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* 💬 COMMENT */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "/add-comment",
        { postId: data._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setComments(res.data.comments);
        setCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-neutral-800 mb-6 relative">

      {/* HEADER */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={data.userId?.img}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold">
            {data.userId?.username}
          </span>
        </div>
      </div>

      {/* POST IMAGE */}
      <img
        src={data.image}
        alt=""
        className="w-full max-h-[450px] object-cover"
      />

      {/* CAPTION */}
      <div className="px-6 py-2 text-gray-300">
        <span className="font-semibold mr-2">
          {data.userId?.username}
        </span>
        {data.caption}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-5 items-center">

          {/* LIKE */}
          <div className="flex items-center gap-1">
            <img
              src={liked ? heartRed : heart}
              className="w-5 cursor-pointer"
              onClick={handleLike}
              alt="like"
            />
            <span className="text-xs text-gray-400">
              {likeCount}
            </span>
          </div>

          {/* COMMENT */}
          <img
            src={commentIcon}
            className="w-5 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
            alt="comment"
          />

          {/* SHARE */}
          <img
            src={send}
            className="w-5 cursor-pointer"
            onClick={() => onShare?.(data)}
            alt="share"
          />
        </div>

        {/* SAVE */}
        <img
          src={bookmark}
          className={`w-5 cursor-pointer ${saved ? "" : "opacity-50"}`}
          onClick={() => setSaved(!saved)}
          alt="save"
        />
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="px-6 pb-4">
          {comments.map((c, i) => (
            <div key={i} className="text-sm text-gray-300 mb-1">
              <span className="font-semibold mr-2">
                {c.username}
              </span>
              {c.text}
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-neutral-800 p-2 rounded"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleComment}
              className="text-blue-500"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/40">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
