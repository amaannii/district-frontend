import React, { useState, useEffect } from "react";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

function PostCard({ data, onShare }) {
  const token = localStorage.getItem("userToken");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState(false);

  // Initialize post data
  useEffect(() => {
    if (!data) return;

    setComments(data.comments || []);
    setLikeCount(data.likes || 0);
    setLiked(data.isLiked || false);
  }, [data]);

  // LIKE POST
  const handleLike = async () => {
    if (!token) return alert("Login required");

    try {
      const res = await axios.post(
        "http://localhost:3001/user/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLikeCount(res.data.likes);
        setLiked(res.data.isLiked);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ADD COMMENT
  const handleComment = async () => {
    if (!token) return alert("Login required");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/user/add-comment",
        { postId: data._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    if (!token) return alert("Login required");

    try {
      const res = await axios.delete(
        "http://localhost:3001/user/delete-comment",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId: data._id, commentId },
        }
      );

      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div className="border-b border-neutral-800 mb-6">

      {/* USER INFO */}
      <div className="px-6 py-3 flex items-center gap-2">
        <img
          src={data.userId?.img || "/default-avatar.png"}
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-semibold">{data.userId?.username}</span>
      </div>

      {/* IMAGE */}
      <img
        src={data.image}
        alt="post"
        className="w-full max-h-[450px] object-cover"
      />

      {/* CAPTION */}
      <div className="px-6 py-2 text-gray-300">
        <span className="font-semibold mr-2">{data.userId?.username}</span>
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
            <span className="text-xs text-gray-400">{likeCount}</span>
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
            onClick={() => onShare && onShare(data)}
            alt="share"
          />
        </div>

        {/* BOOKMARK */}
        <img
          src={bookmark}
          className={`w-5 cursor-pointer ${saved ? "" : "opacity-50"}`}
          onClick={() => setSaved(!saved)}
          alt="bookmark"
        />
      </div>

    { /* COMMENTS */ }
{showComments && (
  <div className="px-6 pb-4">
    {comments.map((c) => (
      <div key={c._id} className="flex justify-between items-start text-sm text-gray-300 mb-2">
        <div>
          <span className="font-semibold mr-2">{c.username}</span>
          {c.text}
          <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
        </div>

        {String(c.userId) === String(currentUser?.id) && (
          <button
            onClick={async () => {
              try {
                const res = await axios.delete("http://localhost:3001/user/delete-comment", {
                  headers: { Authorization: `Bearer ${token}` },
                  data: { postId: data._id, commentId: c._id },
                });
                if (res.data.success) setComments((prev) => prev.filter((cm) => cm._id !== c._id));
              } catch (err) {
                console.error(err);
              }
            }}
            className="text-gray-400 hover:text-red-500 ml-3"
          >
            ✖
          </button>
        )}
      </div>
    ))}

    <div className="flex gap-2 mt-3">
      <input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 bg-neutral-800 p-2 rounded"
        placeholder="Add a comment..."
      />
      <button onClick={async () => {
        if (!commentText.trim()) return;
        try {
          const res = await axios.post(
            "http://localhost:3001/user/add-comment",
            { postId: data._id, text: commentText },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            setComments((prev) => [...prev, res.data.comment]);
            setCommentText("");
          }
        } catch (err) { console.error(err); }
      }} className="text-blue-500 font-semibold">Post</button>
    </div>
    
  </div>
)}

    </div>
  );
}

export default PostCard;
