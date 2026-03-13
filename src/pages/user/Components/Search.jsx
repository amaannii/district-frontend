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
import PostCard from "../Components/PostCard";
import profile from "../../../assets/images/icons8-profile-50.png";
import Swal from "sweetalert2";
import API from "../../../API/Api";

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
  const [connecting, setconnecting] = useState(false);
  const [requested, setrequested] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");
    if (stored) setRecentUsers(JSON.parse(stored));

    const storedRequests = localStorage.getItem("requestedUsers");
    if (storedRequests) setRequestedUsers(JSON.parse(storedRequests));

    const fetchUsers = async () => {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      try {
        const res = await API.get("/user/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setUsers(res.data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchFullPost = async (postId) => {
    if (!postId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const res = await API.get(`/user/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedPost(res.data.post);
    } catch (error) {
      console.error("Failed to fetch full post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    // reset first
    setconnecting(false);
    setrequested(false);

    const token = localStorage.getItem("userToken");

    try {
      setLoading(true);
      const res = await API.get(`/user/connection-status/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "connected") {
        setconnecting(true);
      } else if (res.data.status === "requested") {
        setrequested(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

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
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("userToken");
      setLoading(true);
      const response = await API.post(
        "/user/request",
        { username: selectedUser.username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setrequested(true);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Request Send Successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRequest = async () => {
    const token = localStorage.getItem("userToken");

    try {
      setLoading(true);
      await API.post(
        "/user/remove-connection",
        { username: selectedUser.username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setconnecting(false);
      setrequested(false);
      setShowRemoveModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const listToShow = search ? searchResults : recentUsers;

  return (
    <div className="flex flex-col lg:flex-row bg-black text-white w-full min-h-screen overflow-hidden">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-[320px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col max-h-[40vh] lg:max-h-none">
        {" "}
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
            <span className="text-sm">{search ? "Results" : "Recent"}</span>

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
        <div className="flex-1 overflow-y-auto px-4 pb-6 max-h-[30vh] lg:max-h-none">
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
                    src={user.img || profile}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover "
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </div>

                {!search && (
                  <button
                    onClick={() => handleDeleteRecent(user._id)}
                    className="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
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
      <div className="hidden lg:block flex-1 overflow-y-auto">
        {selectedUser ? (
          <div className="w-full flex flex-col items-center p-4 sm:p-8 lg:p-10 text-center">
            <img
              src={selectedUser.img || profile}
              alt={selectedUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover mb-4"
            />

            <h2 className="text-base sm:text-lg lg:text-xl break-words leading-tight">
              <strong>@{selectedUser.username}</strong>
              <br />
              {selectedUser.name}
            </h2>

            {/* BIO */}
            {selectedUser.bio && (
              <p className="text-gray-400 text-sm mt-2 max-w-md">
                {selectedUser.bio}
              </p>
            )}

            {/* CONNECTION COUNTS */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-300">
              <span>
                <strong>{selectedUser.connectedCount || 0}</strong> Connected
              </span>

              <span>
                <strong>{selectedUser.connectingCount || 0}</strong> Connecting
              </span>

              <span>
                <strong>{selectedUser.post?.length || 0}</strong> Posts
              </span>
            </div>

            <button
              onClick={() => {
                if (connecting) {
                  setShowRemoveModal(true); // ✅ open modal if connected
                } else if (requested) {
                  setShowRemoveModal(true); // ✅ open modal if requested
                } else {
                  handleRequest(); // ✅ send request
                }
              }}
              className={`h-[36px] w-[130px] sm:w-[150px] lg:w-[160px] text-sm sm:text-base text-white rounded-md mb-6
    ${connecting ? "bg-[#4a5218]" : requested ? "bg-gray-600" : "bg-[#879F00]"}
  `}
            >
              {connecting ? "Connected" : requested ? "Requested" : "Connect"}
            </button>

            <hr className="w-full mb-6 border-gray-700" />

            {activeTab === "posts" && (
              <>
                {selectedUser.post && selectedUser.post.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 w-full max-w-5xl">
                    {selectedUser.post.map((post, index) => (
                      <img
                        key={index}
                        src={post.image}
                        alt="post"
                        className="w-full h-[160px] sm:h-[200px] md:h-[230px] object-cover cursor-pointer"
                        onClick={() => fetchFullPost(post._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No posts available</p>
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
          <div className="bg-black border border-gray-700 rounded-xl p-5 sm:p-6 w-full max-w-[320px] text-center">
            <h3 className="text-lg font-semibold mb-4">
              {connecting ? "Remove Connection?" : "Remove Request?"}
            </h3>

            <p className="text-gray-400 mb-6 text-sm">
              {connecting
                ? "Do you want to remove this connection?"
                : "Do you want to remove the connection request?"}
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
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPost(null)}
          ></div>

          <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-3 sm:mx-6 bg-black rounded-xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg"
            >
              ✕
            </button>

            <div className="max-h-[85vh] overflow-y-auto scrollbar-hide px-2 sm:px-0">
              <PostCard
                data={selectedPost}
                user={null}
                setSelectedUsername={() => {}}
                setActivePage={() => {}}
                setActive={() => {}}
                setSelectedUserId={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE USER PROFILE POPUP */}
      {selectedUser && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black overflow-y-auto flex items-center justify-center">
          <div className="p-6 flex flex-col items-center text-center">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>

            {/* PROFILE IMAGE */}
            <img
              src={selectedUser.img || profile}
              alt={selectedUser.name}
              className="w-24 h-24 rounded-full object-cover mb-4 mt-24"
            />

            <h2 className="text-lg">
              <strong>@{selectedUser.username}</strong>
              <br />
              {selectedUser.name}
            </h2>

            {/* BIO */}
            {selectedUser.bio && (
              <p className="text-gray-400 text-sm mt-2 max-w-md">
                {selectedUser.bio}
              </p>
            )}

            {/* CONNECTION COUNTS */}
            <div className="flex gap-6 mt-4 text-sm text-gray-300">
              <span>
                <strong>{selectedUser.connectedCount || 0}</strong> Connected
              </span>

              <span>
                <strong>{selectedUser.connectingCount || 0}</strong> Connecting
              </span>

              <span>
                <strong>{selectedUser.post?.length || 0}</strong> Posts
              </span>
            </div>

            {/* CONNECT BUTTON */}
            <button
              onClick={() => {
                if (connecting || requested) {
                  setShowRemoveModal(true);
                } else {
                  handleRequest();
                }
              }}
              className={`h-[36px] w-[150px] text-white rounded-md mt-4 mb-6
        ${connecting ? "bg-[#4a5218]" : requested ? "bg-gray-600" : "bg-[#879F00]"}`}
            >
              {connecting ? "Connected" : requested ? "Requested" : "Connect"}
            </button>

            {/* POSTS GRID */}
            {selectedUser.post && selectedUser.post.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {selectedUser.post.map((post, index) => (
                  <img
                    key={index}
                    src={post.image}
                    className="w-full h-[160px] object-cover"
                    onClick={() => fetchFullPost(post._id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No posts available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
