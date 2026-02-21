import React, { useState, useEffect } from "react";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import bookmarkFilled from "../../../assets/images/icons8-bookmark-30 (1).png";


function PostCard({ data, onShare }) {
  const token = localStorage.getItem("userToken");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState(false);

  // Delete modal state
  const [commentToDelete, setCommentToDelete] = useState(null);

 useEffect(() => {
  if (!data) return;

  setComments(data.comments || []);
  setLikeCount(data.likes || 0);
  setLiked(data.isLiked || false);
  setSaved(data.isSaved || false);
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
      console.error(err);
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
      console.error(err);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async () => {
    if (!token || !commentToDelete) return;

    try {
      const res = await axios.delete(
        "http://localhost:3001/user/delete-comment",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId: data._id, commentId: commentToDelete._id },
        }
      );
      if (res.data.success) {
        setComments((prev) =>
          prev.filter((c) => c._id !== commentToDelete._id)
        );
        setCommentToDelete(null); // close modal
      }
    } catch (err) {
      console.error(err);
    }
  };


// Add function to save post
const handleSave = async () => {
  if (!token) return alert("Login required");

  try {
    const res = await axios.post(
      "http://localhost:3001/user/save-post",
      { postId: data._id, username: data.userId.username },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setSaved(res.data.saved); // backend should return { success: true, saved: true/false }

      // Optional: update localStorage for faster access in other components
      const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
      if (res.data.saved) {
        localStorage.setItem(
          "savedPosts",
          JSON.stringify([...savedPosts, { postId: data._id }])
        );
      } else {
        localStorage.setItem(
          "savedPosts",
          JSON.stringify(savedPosts.filter((p) => p.postId !== data._id))
        );
      }
    }
  } catch (err) {
    console.error(err);
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

<img
  src={saved ? bookmarkFilled : bookmark}
  className="w-6 cursor-pointer"
  onClick={handleSave}
  alt="bookmark"
/>



      </div>

      {/* COMMENTS */}
      {/* COMMENTS */}
{showComments && (
  <div className="px-6 pb-4">
    {comments.map((c) => (
      <div
        key={c._id}
        className="flex justify-between items-start text-sm text-gray-300 mb-2"
      >
        <div>
          <span className="font-semibold mr-2">{c.username}</span>
          {c.text}
          <div className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </div>
        </div>

        {/* THREE DOT MENU FOR DELETE */}
        {(String(c.userId) === String(currentUser?.id) ||
          String(data.userId?._id) === String(currentUser?.id)) && (
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setCommentToDelete(c)}
            >
              ⋮
            </button>
          </div>
        )}
      </div>
    ))}

    {/* Add Comment */}
    <div className="flex gap-2 mt-3">
      <input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 bg-neutral-800 p-2 rounded"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleComment}
        className="text-blue-500 font-semibold"
      >
        Post
      </button>
    </div>
  </div>
)}


      {/* DELETE CONFIRMATION MODAL */}
    {/* DELETE CONFIRMATION MODAL */}
{commentToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-neutral-900 p-5 rounded-lg w-80 text-white">
      <p className="mb-4">
        Delete comment by <strong>{commentToDelete.username}</strong>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setCommentToDelete(null)}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
          onClick={handleDeleteComment}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default PostCard;
