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
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");
    if (stored) setRecentUsers(JSON.parse(stored));

    const storedRequests = localStorage.getItem("requestedUsers");
    if (storedRequests) setRequestedUsers(JSON.parse(storedRequests));

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3001/user/allusers");
        if (res.data.success) setUsers(res.data.users);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
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
    if (!selectedUser || requestedUsers.includes(selectedUser._id)) return;

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://localhost:3001/user/request",
        { username: selectedUser.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updated = [...requestedUsers, selectedUser._id];
        setRequestedUsers(updated);
        localStorage.setItem("requestedUsers", JSON.stringify(updated));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveRequest = () => {
    const updated = requestedUsers.filter(
      (id) => id !== selectedUser._id
    );
    setRequestedUsers(updated);
    localStorage.setItem("requestedUsers", JSON.stringify(updated));
    setShowRemoveModal(false);
  };

  const listToShow = search ? searchResults : recentUsers;

  return (
    <div className="flex flex-col lg:flex-row bg-black text-white w-full min-h-screen">

      {/* LEFT SECTION */}
      <div className="w-full lg:w-[320px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col">

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

        <div className="flex-1 overflow-y-auto px-4 pb-6">
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

      {/* RIGHT PROFILE SECTION */}
      <div className="flex-1 overflow-y-auto">
        {selectedUser ? (
          <div className="w-full flex flex-col items-center p-6 sm:p-10 text-center">

            <img
              src={selectedUser.img}
              alt={selectedUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-4"
            />

            <h2 className="text-lg sm:text-xl mb-4 break-words">
              <strong>@{selectedUser.username}</strong>
              <br />
              {selectedUser.name}
            </h2>

            <button
              onClick={() => {
                if (requestedUsers.includes(selectedUser._id)) {
                  setShowRemoveModal(true);
                } else {
                  handleRequest();
                }
              }}
              className={`h-[35px] w-[140px] sm:w-[160px] text-white rounded-md mb-6 ${
                requestedUsers.includes(selectedUser._id)
                  ? "bg-gray-600"
                  : "bg-[#879F00]"
              }`}
            >
              {requestedUsers.includes(selectedUser._id)
                ? "Requested"
                : "Connect"}
            </button>

            <hr className="w-full mb-6 border-gray-700" />

            {activeTab === "posts" && (
              <>
                {selectedUser.post && selectedUser.post.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-5xl">
                    {selectedUser.post.map((post, index) => (
                      <img
                        key={index}
                        src={post.image}
                        alt="post"
                        className="w-full h-[220px] sm:h-[250px] object-cover cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No posts available
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center">
            <p className="text-gray-500">
              Search and select a user to view their profile
            </p>
          </div>
        )}
      </div>

      {/* REMOVE REQUEST MODAL */}
      {showRemoveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-black border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">
              Remove Request?
            </h3>

            <p className="text-gray-400 mb-6 text-sm">
              Do you want to remove the connection request?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleRemoveRequest}
                className="px-4 py-2 bg-red-600 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default Search;