import React, { useEffect, useState } from "react";
import settings from "../../../assets/images/icons8-settings-50.png";
import profile from "../../../assets/images/profile.png";
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

  /* ---------------- FETCH SAVED POSTS ---------------- */
  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedPost();
    }
  }, [activeTab]);


  const isPostOwner =
  activeTab === "posts" ||
  selectedPost?.postOwner?.username === userdetails.username;

 const fetchSavedPost = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3001/user/get-saved-posts",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data) {
      setSavedPost(res.data);
    }
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


const fetchConnections = async (type) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/user/${type}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setConnectionList(res.data);
    setConnectionType(type);
    setShowConnections(true);
  } catch (error) {
    console.error(error);
  }
};

  const handleUnsave = async () => {
  try {
    await axios.delete(
      `http://localhost:3001/user/unsave/${selectedPost._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSavedPost(prev =>
  prev.filter(p => p._id !== selectedPost._id)
);

    setselectedPost(null);

  } catch (error) {
    console.error(error);
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

  const isOwner =
    userdetails._id === localStorage.getItem("userId");

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

            <h1 className="text-xl font-semibold">
              {userdetails.username}
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              {userdetails.name}
            </p>

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
                <img
                  key={index}
                  src={item.image}
                  alt=""
                  className="w-full h-[400px] object-cover cursor-pointer"
                  onClick={() => setselectedPost(item)}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#0f0f0f] w-[800px] h-[500px] rounded-xl flex">
            <div className="w-1/2">
              <img
                src={selectedPost.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-1/2 p-4 flex flex-col">
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="font-semibold">
                  {activeTab === "saved"
    ? selectedPost?.postOwner?.username
    : userdetails.username}
                </span>

                {isPostOwner && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditedCaption(selectedPost.caption);
                      }}
                      className="text-blue-400 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmModal({ show: true, type: "delete" })
                      }
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
                 {activeTab === "saved" && (
      <button
        onClick={handleUnsave}
        className="text-yellow-400 text-sm"
      >
        Unsave
      </button>
    )}

              </div>

              <div className="flex-1 text-sm mt-3">
                {isEditing ? (
                  <>
                    <textarea
                      value={editedCaption}
                      onChange={(e) =>
                        setEditedCaption(e.target.value)
                      }
                      className="w-full bg-black border border-gray-600 p-2 rounded text-white"
                    />

                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          type: "update",
                        })
                      }
                      className="mt-3 bg-[#879F00] px-4 py-1 rounded text-sm"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  selectedPost.caption
                )}
              </div>

              <button
                onClick={() => setselectedPost(null)}
                className="mt-4 bg-[#879F00] py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-[350px] p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-4">
              {confirmModal.type === "delete"
                ? "Delete Post?"
                : "Update Post?"}
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
                onClick={() =>
                  setConfirmModal({ show: false, type: null })
                }
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
        <h2 className="text-lg font-semibold capitalize">
          {connectionType}
        </h2>
        <button
          onClick={() => setShowConnections(false)}
          className="text-gray-400"
        >
          ✕
        </button>
      </div>

      {connectionList.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No {connectionType} yet
        </p>
      ) : (
        connectionList.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 py-2 border-b border-gray-800"
          >
            <img
              src={user.img || profile}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">
                {user.username}
              </p>
              <p className="text-xs text-gray-400">
                {user.name}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
    </>
  );
}

export default Profile;