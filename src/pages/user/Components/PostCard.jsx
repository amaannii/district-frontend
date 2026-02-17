import React, { useState } from "react";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

function PostCard({ data, onShare }) {
  const token = localStorage.getItem("userToken");

  const [liked, setLiked] = useState(data.isLiked || false);
  const [likeCount, setLikeCount] = useState(data.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(data.comments || []);
  const [saved, setSaved] = useState(false);

  // ----------- Like / Unlike -----------
  const handleLike = async () => {
    if (!token) return alert("You must be logged in");

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await axios.post(
        "http://localhost:3001/user/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLiked(res.data.isLiked);
        setLikeCount(res.data.likes);
      }
    } catch (err) {
      console.error(err);
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  // ----------- Add Comment -----------
  const handleComment = async () => {
    if (!token) return alert("You must be logged in");
    if (!commentText.trim()) return;

    const tempComment = {
      _id: Math.random().toString(36).substr(2, 9),
      username: "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, tempComment]);
    setCommentText("");

    try {
      const res = await axios.post(
        "http://localhost:3001/user/add-comment",
        { postId: data._id, text: tempComment.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setComments(prev =>
          prev.map(c => (c._id === tempComment._id ? res.data.comment : c))
        );
      }
    } catch (err) {
      console.error(err);
      setComments(prev => prev.filter(c => c._id !== tempComment._id));
    }
  };

  // ----------- Delete Comment -----------
  const handleDeleteComment = async (commentId) => {
    if (!token) return alert("You must be logged in");

    try {
      const res = await axios.delete(
        "http://localhost:3001/user/delete-comment",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId: data._id, commentId }
        }
      );

      if (res.data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        alert(res.data.message || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while deleting comment");
    }
  };

  return (
    <div className="border-b border-neutral-800 mb-6 relative">
      {/* User Info */}
      <div className="px-6 py-3 flex items-center gap-2">
        <img
          src={data.userId?.img}
          className="w-8 h-8 rounded-full object-cover"
          alt={data.userId?.username}
        />
        <span className="font-semibold">{data.userId?.username}</span>
      </div>

      {/* Post Image */}
      <img
        src={data.image}
        className="w-full max-h-[450px] object-cover"
        alt="post"
      />

      {/* Caption */}
      <div className="px-6 py-2 text-gray-300">
        <span className="font-semibold mr-2">{data.userId?.username}</span>
        {data.caption}
      </div>

      {/* Actions */}
      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-5 items-center">
          {/* Like */}
          <div className="flex items-center gap-1">
            <img
              src={liked ? heartRed : heart}
              className="w-5 cursor-pointer"
              onClick={handleLike}
              alt="like"
            />
            <span className="text-xs text-gray-400">{likeCount}</span>
          </div>
          {/* Comment */}
          <img
            src={commentIcon}
            className="w-5 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
            alt="comment"
          />
          {/* Share */}
          <img
            src={send}
            className="w-5 cursor-pointer"
            onClick={() => onShare?.(data)}
            alt="share"
          />
        </div>
        {/* Bookmark */}
        <img
          src={bookmark}
          className={`w-5 cursor-pointer ${saved ? "" : "opacity-50"}`}
          onClick={() => setSaved(!saved)}
          alt="bookmark"
        />
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="text-sm text-gray-300 mb-1 flex justify-between items-start"
            >
              <div>
                <span className="font-semibold mr-2">{c.username}</span>
                {c.text}
                <div className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              {/* Delete button for own comment */}
              {c.username === "You" && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-xs ml-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {/* Add Comment Input */}
          <div className="flex gap-2 mt-2">
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
    </div>
  );
}

export default PostCard;
