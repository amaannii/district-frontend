import React, { useState, useEffect } from "react";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import socket from "../../../Socket";
import profile from "../../../assets/images/icons8-profile-50.png";
import API from "../../../API/Api";

function PostCard({
  setSelectedUsername,
  data,
  user,
  setActive,
  setSelectedUserId,
}) {
  const token = localStorage.getItem("userToken");
  // const currentUser = JSON.parse(token);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Delete modal state
  const [commentToDelete, setCommentToDelete] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!data) return;

    setComments(data.comments || []);
    setLikeCount(data.likes || 0);
    setLiked(data.isLiked || false);
    setSaved(data.isSaved || false);
     setCommentToDelete(false);
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
    if (!token) {
      showNotification("Login required", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post(
        "/user/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setLikeCount(res.data.likes);
        setLiked(res.data.isLiked);

        socket.emit("likePost", {
          postId: data._id,
          user: user,
        });

        if (res.data.isLiked) {
          showNotification("Post liked!", "success");
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to like post", "error");
    } finally {
      setLoading(false);
    }
  };

  // ADD COMMENT
  const handleComment = async () => {
    if (!token) {
      showNotification("Login required", "error");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(
        "/user/add-comment",
        { postId: data._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
        showNotification("Comment added!", "success");

        socket.emit("newComment", {
          postId: data._id,
          comment: res.data.comment,
        });
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to add comment", "error");
    } finally {
      setLoading(false);
    }
  };

  // SAVE POST
  const handleSave = async () => {
    if (!token) {
      showNotification("Login required", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(
        "/user/save-post",
        { postId: data._id, username: data.userId?.username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setSaved(res.data.isSaved);
        showNotification(
          res.data.isSaved ? "Post saved!" : "Post unsaved!",
          "success",
        );
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to save post", "error");
    } finally {
      setLoading(false);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setLoading(true);
      const res = await API.post(
        "/user/delete-comment",
        {
          postId: data._id,
          commentId: commentToDelete,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success == true) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
        showNotification("Comment deleted!", "success");

        socket.emit("deleteComment", {
          postId: data._id,
          commentId: commentToDelete,
        });

        setCommentToDelete(false);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete others comment", "error");
    } finally {
      setLoading(false);
    }
  };

  // SHARE POST
  const handleSendPost = async () => {
    if (!selectedDistricts.length) {
      showNotification("Select at least one district", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(
        "/user/send-post-to-chats",
        { chatIds: selectedDistricts, postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setShowShare(false);
        showNotification(
          `Post shared to ${selectedDistricts.length} districts`,
          "success",
        );

        socket.emit("sharePost", {
          postId: data._id,
          districts: selectedDistricts,
          sender: user,
        });

        setSelectedDistricts([]);
      }
    } catch (err) {
      console.error("Share failed:", err);
      showNotification("Failed to share post", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleUserClick = () => {
    if (data.userId?.username?.toString() === user?.toString()) {
      setActive("PROFILE");
    } else {
      setSelectedUsername(data.userId?.username);
      setActive("UPROFILE");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if current user can delete comment
const canDeleteComment = (comment) => {
  return (
    comment.username?.toString() === user?.toString() ||
    data.userId?.username?.toString() === user?.toString()
  );
};

  return (
    <div className="border border-neutral-800/50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 w-full max-w-xl sm:max-w-2xl mx-auto bg-gradient-to-b from-neutral-900/50 to-black overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* USER INFO */}
      <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm">
        <div
          onClick={handleUserClick}
          className="relative cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden  group-hover:ring-[#879F00] transition-all">
            <img
              src={data.userId?.img || profile}
              alt={data.userId?.username}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => (e.target.src = profile)}
            />
          </div>
        </div>

        <div className="flex-1">
          <span
            onClick={handleUserClick}
            className="font-semibold text-sm sm:text-base hover:underline cursor-pointer"
          >
            {data.userId?.username}
          </span>
          <p className="text-[10px] sm:text-xs text-gray-500">
            {formatDate(data.createdAt)}
          </p>
        </div>
      </div>

      {/* IMAGE WITH LOADING STATE */}
      <div className="relative bg-neutral-900">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#879F00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={data.image}
          alt="post"
          className={`w-full max-h-[350px] sm:max-h-[500px] object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>

      {/* CAPTION */}
      <div className="px-3 sm:px-5 py-2 sm:py-3 text-gray-300 text-xs sm:text-sm leading-relaxed bg-black/20">
        <span className="font-semibold mr-2 text-white">
          {data.userId?.username}
        </span>
        <span className="break-words">{data.caption}</span>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center px-3 sm:px-5 py-2 sm:py-3 border-t border-neutral-800/50">
        <div className="flex gap-4 sm:gap-6 items-center">
          {/* LIKE */}
          <div className="flex items-center gap-1.5 group">
            <button
              onClick={handleLike}
              disabled={loading}
              className="transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <img
                src={liked ? heartRed : heart}
                className="w-5 h-5 sm:w-6 sm:h-6"
                alt="like"
              />
            </button>
            <span className="text-xs sm:text-sm font-medium text-gray-300 min-w-[20px]">
              {likeCount}
            </span>
          </div>

          {/* COMMENT */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="transform transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <img
              src={commentIcon}
              className="w-5 h-5 sm:w-6 sm:h-6"
              alt="comment"
            />
          </button>

          {/* SHARE */}
          <button
            onClick={() => setShowShare(true)}
            className="transform transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <img src={send} className="w-5 h-5 sm:w-6 sm:h-6" alt="share" />
          </button>
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200"
            fill={saved ? "#879F00" : "none"}
            stroke={saved ? "#879F00" : "white"}
            strokeWidth="2"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="px-3 sm:px-5 py-3 sm:py-4 bg-black/40 border-t border-neutral-800/50 animate-slideDown">
          {/* Comments List */}
          <div className="max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#879F00]/30 scrollbar-track-transparent pr-2 mb-3 space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="group relative bg-neutral-900/50 rounded-lg p-2 sm:p-3 hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs sm:text-sm text-[#879F00]">
                          {c.username}
                        </span>
                        <span className="text-[8px] sm:text-xs text-gray-600">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm break-words">
                        {c.text}
                      </p>
                    </div>

                    {/* DELETE COMMENT BUTTON - FIXED */}
                    {c.username?.toString() === user?.toString() && (
                      <button
                        onClick={() => setCommentToDelete(c._id)}
                        className=" text-red-500 hover:text-red-400 text-xs sm:text-sm"
                        title="Delete comment"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
                className="w-full bg-neutral-800/80 text-white text-xs sm:text-sm px-3 py-2 sm:py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#879F00] transition-all pr-10"
                placeholder="Write a comment..."
                maxLength={200}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-xs text-gray-500">
                {commentText.length}/200
              </span>
            </div>
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || loading}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${
                commentText.trim()
                  ? "bg-[#879F00] hover:bg-[#9fb800] text-white"
                  : "bg-neutral-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* DELETE COMMENT MODAL */}
   {commentToDelete  && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 p-5 sm:p-6 rounded-xl w-full max-w-sm border border-neutral-800 shadow-2xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white text-center">
              Delete Comment?
            </h3>

            <p className="text-gray-400 text-xs sm:text-sm mb-6 text-center">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setCommentToDelete(false)}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteComment}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShare && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col border border-neutral-800 shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Share Post
              </h2>
              <button
                onClick={() => {
                  setShowShare(false);
                  setSelectedDistricts([]);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Selected Count */}
            {selectedDistricts.length > 0 && (
              <div className="px-4 sm:px-5 py-2 bg-[#879F00]/10 border-b border-neutral-800">
                <p className="text-xs sm:text-sm text-[#879F00]">
                  Selected: {selectedDistricts.length} district
                  {selectedDistricts.length > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Scrollable District List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#879F00]/30 scrollbar-track-transparent p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-1">
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
                    className={`p-3 cursor-pointer rounded-lg text-xs sm:text-sm transition-all duration-200
                      ${
                        selectedDistricts.includes(district)
                          ? "bg-[#879F00] text-white font-medium transform scale-[1.02]"
                          : "hover:bg-neutral-800 text-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{district}</span>
                      {selectedDistricts.includes(district) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Buttons */}
            <div className="p-4 sm:p-5 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => {
                  handleSendPost();
                }}
                disabled={!selectedDistricts.length || loading}
                className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  selectedDistricts.length && !loading
                    ? "bg-[#879F00] hover:bg-[#9fb800] text-white"
                    : "bg-neutral-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sharing...</span>
                  </div>
                ) : (
                  `Share to ${selectedDistricts.length} district${selectedDistricts.length !== 1 ? "s" : ""}`
                )}
              </button>

              <button
                onClick={() => {
                  setShowShare(false);
                  setSelectedDistricts([]);
                }}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm sm:text-base transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="chaotic-orbit"></div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {showAlert && (
        <div className="fixed top-5 right-5 z-50 animate-slideInRight">
          <div
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-2xl flex items-center gap-2 ${
              alertMessage.includes("Failed") || alertMessage.includes("error")
                ? "bg-red-600"
                : alertMessage.includes("warning")
                  ? "bg-yellow-600"
                  : "bg-[#879F00]"
            }`}
          >
            {!alertMessage.includes("Failed") &&
              !alertMessage.includes("error") &&
              !alertMessage.includes("warning") && (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            <span className="text-white text-xs sm:text-sm font-medium">
              {alertMessage}
            </span>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(135, 159, 0, 0.3);
          border-radius: 20px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(135, 159, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

export default PostCard;