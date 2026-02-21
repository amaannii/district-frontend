import axios from "axios";
import React, { useEffect, useState } from "react";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import post from "../../../assets/images/icons8-menu-50.png";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import bookmarkFilled from "../../../assets/images/icons8-bookmark-30 (1).png";

function Search() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load recent users + Fetch all users
  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");
    if (stored) {
      setRecentUsers(JSON.parse(stored));
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3001/user/allusers"
        );
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);





const fetchUserPosts = async (userId) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("userToken");

    // Fetch posts and saved posts for this user
    const res = await axios.get(
      `http://localhost:3001/user/${userId}/posts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      setUserPosts(res.data.posts);       // posts created by the user
      setUserSavedPosts(res.data.saved);  // posts they saved
    } else {
      setUserPosts([]);
      setUserSavedPosts([]);
    }
  } catch (error) {
    console.error(error);
    setUserPosts([]);
    setUserSavedPosts([]);
  } finally {
    setLoading(false);
  }
};
  // Save recent users
  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  // Search filter
  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.username || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRequested(false);

    setRecentUsers((prev) => {
      const filtered = prev.filter((u) => u._id !== user._id);
      return [user, ...filtered].slice(0, 6);
    });

    setSearch("");
  };

  const handleDeleteRecent = (id) => {
    setRecentUsers((prev) => prev.filter((user) => user._id !== id));
  };

  const handleClearAll = () => {
    setRecentUsers([]);
    localStorage.removeItem("recentUsers");
  };

  const handleRequest = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:3001/user/request",
        { username: selectedUser.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Request sent successfully");
        setRequested(true);
      } else {
        alert("Request failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const listToShow = search ? searchResults : recentUsers;

  return (
    <div className="flex play-regular text-white bg-black w-full h-full">
      
      {/* ================= LEFT SEARCH COLUMN ================= */}
      <div className="w-[320px] border-r border-gray-800 flex flex-col h-full">

        {/* Header + Input */}
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Search</h1>

          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-white text-black mb-4"
          />

          <div className="flex justify-between mb-2">
            <span className="text-sm">
              {search ? "Results" : "Recent"}
            </span>

            {recentUsers.length > 0 && !search && (
              <span
                className="text-[#879F00] text-sm cursor-pointer"
                onClick={handleClearAll}
              >
                Clear all
              </span>
            )}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {listToShow.length > 0 ? (
            listToShow.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between py-3 hover:bg-gray-800 rounded px-2"
              >
                <div
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={user.img}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {!search && (
                  <button
                    onClick={() => handleDeleteRecent(user._id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              {search ? "No users found" : "No recent searches"}
            </p>
          )}
        </div>
      </div>

      {/* ================= RIGHT PROFILE SECTION ================= */}
      <div className="flex-1 h-full overflow-y-auto">
        {selectedUser ? (
          <div className="w-full min-h-full flex flex-col items-center p-10 text-center">
            <img
              src={selectedUser.img}
              alt={selectedUser.name}
              className="w-28 h-28 rounded-full object-cover mb-4"
            />

            <h2 className="text-xl mb-4">
              <strong>@{selectedUser.username}</strong>
              <br />
              {selectedUser.name}
            </h2>

            <button
              onClick={handleRequest}
              disabled={requested}
              className={`h-[35px] w-[160px] text-white rounded-md mb-6 ${
                requested
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#879F00]"
              }`}
            >
              {requested ? "Requested" : "Connect"}
            </button>

            <hr className="w-full mb-6 border-gray-700" />

            <div className="flex justify-center gap-20 mb-6">
              <button
                onClick={() => setActiveTab("posts")}
                className={
                  activeTab === "posts"
                    ? "border-b-2 border-white"
                    : "opacity-50"
                }
              >
                <img className="h-6 w-5" src={post} alt="posts" />
              </button>

              <button
                onClick={() => setActiveTab("saved")}
                className={
                  activeTab === "saved"
                    ? "border-b-2 border-white"
                    : "opacity-50"
                }
              >
                <img className="h-6 w-7" src={saved} alt="saved" />
              </button>
            </div>

          {activeTab === "posts" && (
  <>
    {selectedUser.post && selectedUser.post.length > 0 ? (
      <div className="grid grid-cols-3 gap-2 max-w-[90%] mx-auto w-full">
        {selectedUser.post.map((post, index) => (
          <img
            key={index}
            src={post.image}
            alt="post"
            className="w-full h-[250px] object-cover cursor-pointer"
            onClick={() => setSelectedPost(post)}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No posts available</p>
    )}
  </>
)}

            {activeTab === "saved" && (
              <p className="text-gray-500">
                Saved posts feature coming soon...
              </p>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Search and select a user to view their profile
            </p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-70">
          <div className="chaotic-orbit"></div>
        </div>
      )}
      {selectedPost && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
    <div className="bg-black rounded-lg max-w-2xl w-full overflow-y-auto max-h-full relative">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-white text-2xl font-bold"
        onClick={() => setSelectedPost(null)}
      >
        ✕
      </button>

      {/* PostCard Content */}
      <div className="border-b border-neutral-800 mb-6">

        {/* USER INFO */}
        <div className="px-6 py-3 flex items-center gap-2">
          <img
            src={selectedUser.img}
            alt={selectedUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold">@{selectedUser.username}</span>
        </div>

        {/* IMAGE */}
        <img
          src={selectedPost.image}
          alt="post"
          className="w-full max-h-[450px] object-cover"
        />

        {/* CAPTION */}
        <div className="px-6 py-2 text-gray-300">
          <span className="font-semibold mr-2">@{selectedUser.username}</span>
          {selectedPost.caption}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between px-6 py-3">
          <div className="flex gap-5 items-center">
            {/* LIKE */}
            <div className="flex items-center gap-1">
              <img
                src={selectedPost.isLiked ? heartRed : heart}
                className="w-5 cursor-pointer"
                onClick={() => handleLike(selectedPost)}
                alt="like"
              />
              <span className="text-xs text-gray-400">{selectedPost.likes}</span>
            </div>

            {/* COMMENT */}
            <img
              src={commentIcon}
              className="w-5 cursor-pointer"
              onClick={() =>
                setSelectedPost({ ...selectedPost, showComments: !selectedPost.showComments })
              }
              alt="comment"
            />

            {/* SHARE */}
            <img
              src={send}
              className="w-5 cursor-pointer"
              onClick={() => console.log("Share post")}
              alt="share"
            />
          </div>

          <img
            src={selectedPost.isSaved ? bookmarkFilled : bookmark}
            className="w-6 cursor-pointer"
            onClick={() => handleSave(selectedPost)}
            alt="bookmark"
          />
        </div>

        {/* COMMENTS */}
        {selectedPost.showComments && (
          <div className="px-6 pb-4">
            {(selectedPost.comments || []).map((c) => (
              <div key={c._id} className="flex justify-between items-start text-sm text-gray-300 mb-2">
                <div>
                  <span className="font-semibold mr-2">{c.username}</span>
                  {c.text}
                  <div className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 bg-neutral-800 p-2 rounded"
                placeholder="Add a comment..."
              />
              <button className="text-blue-500 font-semibold">Post</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Search;
