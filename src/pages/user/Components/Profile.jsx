import React, { useEffect, useState } from "react";
import settings from "../../../assets/images/icons8-settings-50.png";
import profile from "../../../assets/images/profile.png";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import bookmarkFilled from "../../../assets/images/icons8-bookmark-30 (1).png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile({ setActive }) {
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

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null,
  });

  const token = localStorage.getItem("userToken");
  
  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/user/userdetails",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = response.data.user;

      setuserdetails(user);
      setposts(user.post || []);
      setconnected(user.connected?.length || 0);
      setconnecting(user.connecting?.length || 0);
      setSelectedImage(user.img);

      // store id for owner check
      localStorage.setItem("userId", user._id);
    } catch (error) {
      console.error(error);
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
  }, [selectedPost, savedPost]);

  /* ---------------- FETCH SAVED POSTS ---------------- */
  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedPost();
    }
  }, [activeTab]);

  const isPostOwner =
    activeTab === "posts" || selectedPost?.postOwner?.username === userdetails.username;

  const fetchSavedPost = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/user/get-saved-posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) setSavedPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  

  /* ---------------- DELETE POST ---------------- */
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:3001/user/delete-post/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setposts((prev) => prev.filter((p) => p._id !== postId));
      setselectedPost(null);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- UPDATE POST ---------------- */
  const handleUpdatePost = async () => {
    try {
      await axios.put(
        `http://localhost:3001/user/update-post/${selectedPost._id}`,
        { caption: editedCaption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setposts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id
            ? { ...p, caption: editedCaption }
            : p
        )
      );

      setselectedPost({
        ...selectedPost,
        caption: editedCaption,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- CONNECTIONS ---------------- */
 const fetchConnections = async (type) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/user/${type}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setConnectionList(res.data.users); // ✅ FIX HERE
      setConnectionType(type);
      setShowConnections(true);
    }
  } catch (error) {
    console.error(error);
  }
};

  /* ---------------- UNSAVE / SAVE ---------------- */
  const handleUnsave = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/user/unsave/${selectedPost._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(false);
      setSavedPost((prev) => prev.filter((p) => p._id !== selectedPost._id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/user/save-post",
        { postId: selectedPost._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSaved(true);
        setSavedPost((prev) => {
          if (prev.find((p) => p._id === selectedPost._id)) return prev;
          return [...prev, selectedPost];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LIKE ---------------- */
  const handleLike = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/user/like-post",
        { postId: selectedPost._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLiked(res.data.isLiked);
        setLikeCount(res.data.likes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- COMMENT ---------------- */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/user/add-comment",
        { postId: selectedPost._id, text: commentText },
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

  /* ---------------- DELETE COMMENT ---------------- */
  const handleDeleteComment = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (!comment) return;

      // Allow post owner or comment owner to delete
      if (!isPostOwner && comment.username !== userdetails.username) return;

      const res = await axios.post(
        "http://localhost:3001/user/delete-comment",
        { postId: selectedPost._id, commentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- PROFILE IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
      { method: "POST", body: data }
    );
    const result = await res.json();

    if (result.secure_url) {
      setSelectedImage(result.secure_url);
      await axios.post(
        "http://localhost:3001/user/upload",
        { img: result.secure_url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUserDetails();
      seteditprofile(false);
    }
  };

  /* ---------------- POST SHARE ---------------- */
  const handleShare = async (chatIds) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/user/send-post-to-chats",
        { postId: selectedPost._id, chatIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setShowShare(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isOwner = userdetails._id === localStorage.getItem("userId");

  /* ----------------- RETURN UI ----------------- */
  return (
    <>
      <div className="flex h-screen w-full bg-black text-white">
        <div className="flex-1 overflow-y-auto px-10 py-8">
          {/* SETTINGS */}
          <div className="flex justify-end mb-6">
            <img
              className="h-6 cursor-pointer"
              src={settings}
              alt="settings"
              onClick={() => setActive("SETTINGS")}
            />
          </div>

          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center text-center">
            <div
              onClick={() => seteditprofile(true)}
              className="w-20 h-20 rounded-full bg-white overflow-hidden mb-3 cursor-pointer"
            >
              <img
                src={userdetails.img || profile}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-xl font-semibold">{userdetails.username}</h1>
            <p className="text-sm text-gray-400 mb-4">{userdetails.name}</p>

            <div className="flex gap-10 mb-5">
              <div>
                <p className="font-semibold">{posts.length}</p>
                <p className="text-xs text-gray-400">posts</p>
              </div>
             <div
  className="cursor-pointer"
  onClick={() => fetchConnections("connected")}
>
  <p className="font-semibold">{connected}</p>
  <p className="text-xs text-gray-400">connected</p>
</div>
<div
  className="cursor-pointer"
  onClick={() => fetchConnections("connecting")}
>
  <p className="font-semibold">{connecting}</p>
  <p className="text-xs text-gray-400">connecting</p>
</div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex justify-center gap-10 border-t border-gray-700 mt-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-3 ${
                activeTab === "posts"
                  ? "border-t-2 border-white"
                  : "text-gray-400"
              }`}
            >
              POSTS
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-3 ${
                  activeTab === "saved"
                    ? "border-t-2 border-white"
                    : "text-gray-400"
                }`}
              >
                SAVED
              </button>
            )}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-5 max-w-[90%] mx-auto mt-4">
            {(activeTab === "posts" ? posts : savedPost).map(
              (item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-[400px] object-cover cursor-pointer"
                    onClick={() => setselectedPost(item)}
                  />

                  {/* HEART / COMMENT / SHARE / SAVE ICONS overlay */}
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <img
                      src={item.isLiked ? heartRed : heart}
                      className="w-5 cursor-pointer"
                      onClick={() => {
                        setselectedPost(item);
                        handleLike();
                      }}
                    />
                    <img
                      src={commentIcon}
                      className="w-5 cursor-pointer"
                      onClick={() => setselectedPost(item)}
                    />
                    <img
                      src={send}
                      className="w-5 cursor-pointer"
                      onClick={() => {
                        setselectedPost(item);
                        setShowShare(true);
                      }}
                    />
                    <img
                      src={savedPost.some(p => p._id === item._id) ? bookmarkFilled : bookmark}
                      className="w-5 cursor-pointer"
                      onClick={() => {
                        setselectedPost(item);
                        savedPost.some(p => p._id === item._id)
                          ? handleUnsave()
                          : handleSave();
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-[950px] h-[620px] flex rounded-lg overflow-hidden">
            {/* LEFT IMAGE */}
            <div className="w-1/2 bg-black">
              <img
                src={selectedPost.image}
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex flex-col text-white">
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <img
                    src={userdetails.img}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">
                    {selectedPost.postOwner?.username || userdetails.username}
                  </span>
                </div>

                <div className="flex gap-3 text-xs">
                  {isPostOwner && !isEditing && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedCaption(selectedPost.caption);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({ show: true, type: "delete" })
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  <button onClick={() => setselectedPost(null)}>✕</button>
                </div>
              </div>

              {/* CAPTION / EDIT */}
              <div className="px-4 py-3 text-sm border-b border-neutral-800">
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={editedCaption}
                      onChange={(e) => setEditedCaption(e.target.value)}
                      className="bg-neutral-800 p-2 rounded text-sm resize-none"
                      rows={3}
                    />
                    <div className="flex gap-4 text-xs">
                      <button
                        onClick={handleUpdatePost}
                        className="text-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold mr-2">
                      {selectedPost.postOwner?.username || userdetails.username}
                    </span>
                    {selectedPost.caption}
                  </>
                )}
              </div>

              {/* COMMENTS */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between items-start text-sm text-gray-300 mb-3"
                  >
                    <div>
                      <span className="font-semibold mr-2">{c.username}</span>
                      {c.text}
                      <div className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {(c.username === userdetails.username || isPostOwner) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-500 text-xs ml-3"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* ACTION SECTION */}
              <div className="border-t border-neutral-800 px-4 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-5 items-center">
                    {/* LIKE */}
                    <div className="flex items-center gap-1">
                      <img
                        src={liked ? heartRed : heart}
                        className="w-5 cursor-pointer"
                        onClick={handleLike}
                      />
                      <span>{likeCount}</span>
                    </div>

                    {/* COMMENT */}
                    <img
                      src={commentIcon}
                      className="w-5 cursor-pointer"
                      onClick={() => {}}
                    />

                    {/* SHARE */}
                    <img
                      src={send}
                      className="w-5 cursor-pointer"
                      onClick={() => setShowShare(true)}
                    />
                  </div>

                  {/* SAVE */}
                  <img
                    src={saved ? bookmarkFilled : bookmark}
                    className="w-5 cursor-pointer"
                    onClick={saved ? handleUnsave : handleSave}
                  />
                </div>

                {/* ADD COMMENT */}
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-neutral-900 p-2 rounded text-sm"
                  />
                  <button
                    onClick={handleComment}
                    className="text-sm text-green-500"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-[350px] p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-4">
              {confirmModal.type === "delete" ? "Delete Post?" : "Update Post?"}
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  if (confirmModal.type === "delete") {
                    await handleDeletePost(selectedPost._id);
                  } else if (confirmModal.type === "update") {
                    await handleUpdatePost();
                  }
                  setConfirmModal({ show: false, type: null });
                }}
                className="bg-red-600 px-5 py-2 rounded text-sm"
              >
                Confirm
              </button>

              <button
                onClick={() => setConfirmModal({ show: false, type: null })}
                className="bg-gray-600 px-5 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {showConnections && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-[#0f0f0f] w-[400px] max-h-[500px] rounded-xl p-5 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{connectionType}</h2>
        <button onClick={() => setShowConnections(false)} className="text-gray-400">✕</button>
      </div>

      {connectionList.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No {connectionType} yet
        </p>
      ) : (
        connectionList.map((user) => (
          <div key={user._id} className="flex items-center gap-3 py-2 border-b border-gray-800">
            <img
              src={user.img || profile}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-gray-400">{user.name}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
      {/* SHARE MODAL */}
      {showShare && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-[400px] p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-4">Share Post</h2>
            <p className="text-sm text-gray-400 mb-4">Select chats to share</p>
            <button
              onClick={() => handleShare([])}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Share
            </button>
            <button
              onClick={() => setShowShare(false)}
              className="bg-gray-600 px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
