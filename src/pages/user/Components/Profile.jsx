import React, { useEffect, useState, useRef } from "react";
import settings from "../../../assets/images/icons8-settings-50.png";
import profile from "../../../assets/images/icons8-profile-50.png";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import bookmarkFilled from "../../../assets/images/icons8-bookmark-30 (1).png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../../API/Api";

function Profile({ setSelectedUsername, setActive, data, user }) {
  const navigate = useNavigate();

  const [userdetails, setuserdetails] = useState({});
  const [posts, setposts] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [selectedPost, setselectedPost] = useState(null);
  const [editprofile, seteditprofile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [connected, setconnected] = useState(0);
  const [connecting, setconnecting] = useState(0);

  const [showConnections, setShowConnections] = useState(false);
  const [connectionType, setConnectionType] = useState("");
  const [connectionList, setConnectionList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null,
  });

  const [like, setLike] = useState(0);
  const fileInputRef = useRef(null);
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    fetchUserDetails();
    fetchSavedPost();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await API.post(
        "/user/userdetails",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const user = response.data.user;

      setuserdetails(user);
      setposts(
        (user.post || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
      setconnected(user.connected?.length || 0);
      setconnecting(user.connecting?.length || 0);
      setSelectedImage(user.img);

      // store id for owner check
      localStorage.setItem("userId", user._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SYNC SELECTED POST STATES ---------------- */
  useEffect(() => {
    if (selectedPost) {
      setLiked(selectedPost.isLiked || false);
      setLikeCount(selectedPost.likes || 0);
      setComments(selectedPost.comments || []);

      const isSaved = savedPost.some((p) => p._id === selectedPost._id);
      setSaved(isSaved);
    }

    const openSaved = localStorage.getItem("openSaved");

    if (openSaved === "true") {
      setActiveTab("saved");
      localStorage.removeItem("openSaved");
    }
  }, [selectedPost, savedPost]);

  /* ---------------- FETCH SAVED POSTS ---------------- */
  useEffect(() => {
    fetchSavedPost();
  }, [activeTab]);

  const isPostOwner =
    activeTab === "posts" ||
    selectedPost?.postOwner?.username === userdetails.username;

  const fetchSavedPost = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/get-saved-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) setSavedPost(res.data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  /* ---------------- DELETE POST ---------------- */
  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      await API.delete(`/user/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setposts((prev) => prev.filter((p) => p._id !== postId));
      setselectedPost(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE POST ---------------- */
  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      await API.put(
        `/user/update-post/${selectedPost._id}`,
        { caption: editedCaption },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setposts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id ? { ...p, caption: editedCaption } : p,
        ),
      );

      setselectedPost({
        ...selectedPost,
        caption: editedCaption,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CONNECTIONS ---------------- */
  const fetchConnections = async (type) => {
    try {
      setLoading(true);
      const res = await API.get(`/user/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setConnectionList(res.data.users);
        setConnectionType(type);
        setShowConnections(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UNSAVE / SAVE ---------------- */
  const handleUnsave = async () => {
    try {
      setLoading(true);
      await API.delete(`/user/unsave/${selectedPost._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSaved(false);
      setSavedPost((prev) => prev.filter((p) => p._id !== selectedPost._id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("Login required");

    const newSavedState = !saved;
    setSaved(newSavedState);

    try {
      setLoading(true);
      const res = await API.post(
        "/user/save-post",
        { postId: selectedPost._id, username: userdetails.username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.data.success) {
        setSaved(!newSavedState);
      }
    } catch (err) {
      console.error(err);
      setSaved(!newSavedState);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LIKE ---------------- */
  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await API.post(
        "/user/like-post",
        { postId: selectedPost._id },
        { headers: { Authorization: `Bearer ${token}` } },
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

  /* ---------------- COMMENT ---------------- */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(
        "/user/add-comment",
        { postId: selectedPost._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      const comment = comments.find((c) => c._id === commentId);
      if (!comment) return;

      if (!isPostOwner && comment.username !== userdetails.username) return;

      const res = await API.post(
        "/user/delete-comment",
        { postId: selectedPost._id, commentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = () => {
    if (selectedPost.postOwner?.username === userdetails.username) {
      setActive("PROFILE");
    } else {
      setSelectedUsername(selectedPost.postOwner?.username);
      setActive("UPROFILE");
    }

    setselectedPost(null);
  };

  /* ---------------- PROFILE IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
      { method: "POST", body: data },
    );
    const result = await res.json();

    if (result.secure_url) {
      setSelectedImage(result.secure_url);
      await API.post(
        "/user/upload",
        { img: result.secure_url },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setLoading(false);
      fetchUserDetails();
      seteditprofile(false);
    }
  };

  /* ---------------- POST SHARE ---------------- */
  const handleSendPost = async () => {
    if (!selectedDistricts.length || !selectedPost?._id) {
      console.log("No districts or no post selected");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(
        "/user/send-post-to-chats",
        {
          chatIds: selectedDistricts,
          postId: selectedPost._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Share response:", res.data);

      if (res.data.success) {
        setShowShare(false);
        setSelectedDistricts([]);
      }
    } catch (err) {
      console.error("Share failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!userdetails || !selectedPost) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        console.log(selectedPost._id);

        const res = await API.post(
          "/user/checkisliked",
          { postId: selectedPost._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setLiked(res.data.isLiked);
          setLike(res.data.likes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [selectedPost]);

  const isOwner = userdetails._id === localStorage.getItem("userId");

  /* ----------------- RETURN UI ----------------- */
  return (
    <>
      <div className="flex min-h-screen w-full bg-black text-white">
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-10 py-4 sm:py-6">
          {/* SETTINGS */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <img
              className="h-5 sm:h-6 cursor-pointer"
              src={settings}
              alt="settings"
              onClick={() => setActive("SETTINGS")}
            />
          </div>

          {/* PROFILE HEADER - RESPONSIVE */}
          <div className="flex flex-col items-center text-center">
            <div
              onClick={() => setShowImageConfirm(true)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3 cursor-pointer group"
            >
              <img
                src={
                  userdetails?.img &&
                  userdetails.img !== "null" &&
                  userdetails.img.trim() !== ""
                    ? userdetails.img
                    : profile
                }
                alt="profile"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = profile)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                  Change
                </span>
              </div>
            </div>
            
            <h1 className="text-lg sm:text-xl font-semibold break-all max-w-[250px] sm:max-w-full">
              {userdetails.username}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 break-all max-w-[250px] sm:max-w-full">
              {userdetails.name}
            </p>

            {userdetails.bio && (
              <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center max-w-[280px] sm:max-w-[350px] px-4">
                {userdetails.bio}
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {/* STATS - RESPONSIVE */}
            <div className="flex gap-6 sm:gap-10 my-4 sm:mb-5">
              <div className="text-center">
                <p className="font-semibold text-sm sm:text-base">{posts.length}</p>
                <p className="text-xs text-gray-400">posts</p>
              </div>
              <div
                className="cursor-pointer text-center"
                onClick={() => fetchConnections("connected")}
              >
                <p className="font-semibold text-sm sm:text-base">{connected}</p>
                <p className="text-xs text-gray-400">connected</p>
              </div>
              <div
                className="cursor-pointer text-center"
                onClick={() => fetchConnections("connecting")}
              >
                <p className="font-semibold text-sm sm:text-base">{connecting}</p>
                <p className="text-xs text-gray-400">connecting</p>
              </div>
            </div>
          </div>

          {/* TABS - RESPONSIVE */}
          <div className="flex justify-center gap-6 sm:gap-10 border-t border-gray-700 mt-4 sm:mt-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "border-t-2 border-white text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              POSTS
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "saved"
                  ? "border-t-2 border-white text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              SAVED
            </button>
          </div>

          {/* GRID - RESPONSIVE WITH OVERLAYS */}
          <div className="grid grid-cols-3 gap-[2px] sm:gap-1 md:gap-2 max-w-5xl mx-auto mt-3 sm:mt-4">
            {(activeTab === "posts" ? posts : savedPost).map((item, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden group"
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setselectedPost(item)}
                />

                {/* OVERLAY ICONS - RESPONSIVE */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2 sm:gap-3 items-center">
                    <div className="flex items-center gap-1">
                      <img
                        src={item.isLiked ? heartRed : heart}
                        className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer filter brightness-0 invert"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectedPost(item);
                          handleLike();
                        }}
                      />
                      <span className="text-white text-xs">{item.likes || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <img
                        src={commentIcon}
                        className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer filter brightness-0 invert"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectedPost(item);
                        }}
                      />
                      <span className="text-white text-xs">{item.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* MOBILE BOTTOM ICONS */}
                <div className="absolute bottom-1 left-1 flex gap-1 sm:hidden">
                  <img
                    src={item.isLiked ? heartRed : heart}
                    className="w-4 h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setselectedPost(item);
                      handleLike();
                    }}
                  />
                  <img
                    src={commentIcon}
                    className="w-4 h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setselectedPost(item);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {(activeTab === "posts" ? posts.length === 0 : savedPost.length === 0) && (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16">
              <p className="text-gray-500 text-sm sm:text-base">
                No {activeTab === "posts" ? "posts" : "saved posts"} yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* POST MODAL - FULLY RESPONSIVE */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-0 sm:p-4">
          <div className="
            bg-[#0f0f0f]
            w-full
            h-full
            sm:h-[90vh]
            sm:max-w-4xl
            lg:max-w-5xl
            flex
            flex-col
            sm:flex-row
            rounded-none
            sm:rounded-lg
            overflow-hidden
            relative
          ">
            {/* CLOSE BUTTON - MOBILE */}
            <button
              onClick={() => setselectedPost(null)}
              className="absolute top-3 right-3 sm:hidden z-10 bg-black/50 rounded-full p-2"
            >
              <span className="text-white text-xl">✕</span>
            </button>

            {/* LEFT IMAGE */}
            <div className="w-full sm:w-1/2 bg-black flex items-center justify-center">
              <img
                src={selectedPost.image}
                alt="post"
                className="w-full h-full object-contain sm:object-cover max-h-[40vh] sm:max-h-full"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full sm:w-1/2 flex flex-col text-white h-full">
              {/* HEADER */}
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-neutral-800">
                <div className="flex items-center gap-2 sm:gap-3">
                  <img
                    onClick={handleUserClick}
                    src={selectedPost.avatar || profile}
                    alt="user"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer"
                    onError={(e) => (e.target.src = profile)}
                  />
                  <span
                    onClick={handleUserClick}
                    className="font-semibold text-xs sm:text-sm cursor-pointer hover:underline"
                  >
                    {selectedPost.postOwner?.username || userdetails.username}
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3 text-xs">
                  {isPostOwner && !isEditing && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedCaption(selectedPost.caption);
                        }}
                        className="text-gray-300 hover:text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({ show: true, type: "delete" })
                        }
                        className="text-red-500 hover:text-red-400 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setselectedPost(null)}
                    className="hidden sm:block text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* CAPTION / EDIT */}
              <div className="px-3 sm:px-4 py-2 sm:py-3 text-sm border-b border-neutral-800">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editedCaption}
                      onChange={(e) => setEditedCaption(e.target.value)}
                      className="bg-neutral-800 p-2 rounded text-xs sm:text-sm resize-none w-full"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-3 text-xs">
                      <button
                        onClick={handleUpdatePost}
                        className="text-[#879F00] hover:text-[#9fb800] font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm break-words">
                    <span className="font-semibold mr-2">
                      {selectedPost.postOwner?.username || userdetails.username}
                    </span>
                    {selectedPost.caption}
                  </p>
                )}
              </div>

              {/* COMMENTS - SCROLLABLE */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-xs sm:text-sm text-center py-4">
                    No comments yet
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="flex justify-between items-start text-xs sm:text-sm"
                    >
                      <div className="flex-1">
                        <span className="font-semibold mr-2">{c.username}</span>
                        <span className="break-words">{c.text}</span>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {(c.username === userdetails.username || isPostOwner) && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="text-red-500 text-[10px] sm:text-xs ml-2 hover:text-red-400 flex-shrink-0"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ACTION SECTION */}
              <div className="border-t border-neutral-800 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 sm:gap-5 items-center">
                    {/* LIKE */}
                    <div className="flex items-center gap-1">
                      <img
                        src={liked ? heartRed : heart}
                        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 transition-transform"
                        onClick={handleLike}
                      />
                      <span className="text-xs sm:text-sm">{likeCount}</span>
                    </div>

                    {/* COMMENT */}
                    <img
                      src={commentIcon}
                      className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => document.getElementById('comment-input').focus()}
                    />

                    {/* SHARE */}
                    <img
                      src={send}
                      className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setShowShare(true)}
                    />
                  </div>

                  {/* SAVE */}
                  <svg
                    onClick={handleSave}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-200 hover:scale-110"
                    fill={saved ? "white" : "none"}
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                  </svg>
                </div>

                {/* ADD COMMENT */}
                <div className="mt-2 sm:mt-3 flex gap-2">
                  <input
                    id="comment-input"
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Add a comment..."
                    className="flex-1 bg-neutral-900 px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className={`text-xs sm:text-sm px-3 py-1.5 sm:py-2 rounded ${
                      commentText.trim() 
                        ? 'text-[#879F00] hover:text-[#9fb800] cursor-pointer' 
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL - RESPONSIVE */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] w-full max-w-[320px] sm:max-w-[350px] p-5 sm:p-6 rounded-xl text-center">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {confirmModal.type === "delete" ? "Delete Post?" : "Update Post?"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              {confirmModal.type === "delete" 
                ? "This action cannot be undone." 
                : "Are you sure you want to update this post?"}
            </p>

            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                onClick={async () => {
                  if (confirmModal.type === "delete") {
                    await handleDeletePost(selectedPost._id);
                  } else if (confirmModal.type === "update") {
                    await handleUpdatePost();
                  }
                  setConfirmModal({ show: false, type: null });
                }}
                className="bg-red-600 px-4 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>

              <button
                onClick={() => setConfirmModal({ show: false, type: null })}
                className="bg-gray-600 px-4 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE IMAGE CONFIRM MODAL */}
      {showImageConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] w-full max-w-[300px] sm:max-w-[320px] p-5 sm:p-6 rounded-xl text-center">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add Profile Photo?</h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Choose a photo to set as your profile picture
            </p>

            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setShowImageConfirm(false);
                  fileInputRef.current?.click();
                }}
                className="bg-[#879F00] px-4 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-[#9fb800] transition-colors"
              >
                Yes
              </button>

              <button
                onClick={() => setShowImageConfirm(false)}
                className="bg-gray-600 px-4 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONNECTIONS MODAL - RESPONSIVE */}
      {showConnections && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] w-full max-w-[350px] sm:max-w-[400px] max-h-[70vh] sm:max-h-[500px] rounded-xl p-4 sm:p-5 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-3 sm:mb-4 flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold capitalize">
                {connectionType}
              </h2>
              <button
                onClick={() => setShowConnections(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {connectionList.length === 0 ? (
                <p className="text-gray-400 text-xs sm:text-sm text-center py-8">
                  No {connectionType} yet
                </p>
              ) : (
                <div className="space-y-2">
                  {connectionList.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 sm:gap-3 py-2 px-2 border-b border-gray-800 last:border-0 hover:bg-neutral-900 transition-colors rounded cursor-pointer"
                      onClick={() => {
                        setActive("UPROFILE");
                        setSelectedUsername(user.username);
                        setShowConnections(false);
                      }}
                    >
                      <img
                        src={user.img || profile}
                        alt={user.username}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = profile)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {user.username}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL - RESPONSIVE */}
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bg-neutral-900 rounded-lg w-full max-w-[350px] sm:max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-neutral-700 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-white">Share Post</h2>
              <button
                onClick={() => {
                  setShowShare(false);
                  setSelectedDistricts([]);
                }}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable District List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                Select districts to share with:
              </p>
              <div className="space-y-1">
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
                    className={`p-2 sm:p-3 cursor-pointer rounded text-xs sm:text-sm transition-colors
                      ${
                        selectedDistricts.includes(district)
                          ? "bg-[#879F00] text-white"
                          : "hover:bg-neutral-800 text-gray-300"
                      }
                    `}
                  >
                    {district}
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Buttons */}
            <div className="p-3 sm:p-4 border-t border-neutral-700 space-y-2">
              <button
                onClick={() => {
                  handleSendPost();
                  setShowShare(false);
                }}
                disabled={!selectedDistricts.length}
                className={`w-full py-2 rounded text-xs sm:text-sm transition-colors ${
                  selectedDistricts.length
                    ? 'bg-[#879F00] hover:bg-[#9fb800] cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send to {selectedDistricts.length} {selectedDistricts.length === 1 ? 'district' : 'districts'}
              </button>

              <button
                onClick={() => {
                  setShowShare(false);
                  setSelectedDistricts([]);
                }}
                className="w-full py-2 rounded text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING SPINNER */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </>
  );
}

export default Profile;