import React, { useState, useEffect } from "react";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import bookmarkFilled from "../../../assets/images/icons8-bookmark-30 (1).png";
import socket from "../../../Socket";

function PostCard({ data, onShare, user }) {
  const token = localStorage.getItem("userToken");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // Delete modal state
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  useEffect(() => {
    if (!data) return;

    setComments(data.comments || []);
    setLikeCount(data.likes || 0);
    setLiked(data.isLiked || false);
    setSaved(data.isSaved || false);
  }, [data]);

  const toggleDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district],
    );
  };

  // LIKE POST
  const handleLike = async () => {
    if (!token) return alert("Login required");
    try {
      const res = await axios.post(
        "http://localhost:3001/user/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setLikeCount(res.data.likes);
        setLiked(res.data.isLiked);

        socket.emit("likePost", {
          postId: data._id,
          user: currentUser.username,
        });
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
    if (res.data.success) {
  setComments((prev) => [...prev, res.data.comment]);
  setCommentText("");

  socket.emit("newComment", {
    postId: data._id,
    comment: res.data.comment,
  });
}
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE COMMENT

  // Add function to save post
  const handleSave = async () => {
    if (!token) return alert("Login required");

    try {
      const res = await axios.post(
        "http://localhost:3001/user/save-post",
        { postId: data._id, username: data.userId.username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setSaved(res.data.saved); // backend should return { success: true, saved: true/false }

        // Optional: update localStorage for faster access in other components
        const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
        if (res.data.saved) {
          localStorage.setItem(
            "savedPosts",
            JSON.stringify([...savedPosts, { postId: data._id }]),
          );
        } else {
          localStorage.setItem(
            "savedPosts",
            JSON.stringify(savedPosts.filter((p) => p.postId !== data._id)),
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/user/delete-comment",
        {
          postId: data._id,
          commentId: commentToDelete,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

   if (res.data.success) {
  setComments((prev) => prev.filter((c) => c._id !== commentToDelete));

  socket.emit("deleteComment", {
    postId: data._id,
    commentId: commentToDelete,
  });

  setCommentToDelete(null);
}
    } catch (err) {
      console.error(err);
    }
  };
  const handleShareToChat = async () => {
    if (!data?._id || !selectedDistricts.length) return;

    try {
      const res = await axios.post("/send-post-to-chats", {
        postId: data._id,
        chatIds: selectedDistricts,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSendPost = async () => {
    if (!selectedDistricts.length) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/user/send-post-to-chats",
        { chatIds: selectedDistricts, postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

    if (res.data.success) {
  socket.emit("sharePost", {
    postId: data._id,
    districts: selectedDistricts,
    sender: currentUser.username,
  });

  setShowShare(false);
  setSelectedDistricts([]);
}
    } catch (err) {
      console.error("Share failed:", err);
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
            onClick={() => setShowShare(true)}
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

              {/* ✅ Show delete only if comment belongs to logged-in user */}
              {c.username === user && (
                <button
                  onClick={() => setCommentToDelete(c._id)}
                  className="text-red-500 text-xs ml-3 hover:text-red-400"
                >
                  Delete
                </button>
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
      {commentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg w-80 text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Delete Comment?
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this comment?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setCommentToDelete(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-[#879F00] rounded hover:bg-[#879F00]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg w-80 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Share Post
            </h2>

            {[
              "KASARGOD",
              "KANNUR",
              "ERNAKULAM",
              "KOZHIKODE",
              "IDUKKI",
              "KOTTAYAM",
              "WAYANAD",
              "MALAPPURAM",
              "PALAKKAD",
              "THRISSUR",
              "ALAPPUZHA",
              "KOVALAM",
              "PATHANAMTHITTA",
              "THIRUVANANTHAPURAM",
            ].map((district) => (
              <div
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`p-3 cursor-pointer rounded text-white 
            ${selectedDistricts.includes(district) ? "bg-[#879F00]" : "hover:bg-neutral-800"}
          `}
              >
                {district}
              </div>
            ))}

            <button
              onClick={handleSendPost}
              className="mt-4 w-full py-2 rounded bg-[#879F00] hover:bg-[#879F00]"
            >
              Send
            </button>
            <button
              onClick={() => {
                setShowShare(false);
                setSelectedDistricts([]); // optional: clear selection
              }}
              className="mt-2 w-full py-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
