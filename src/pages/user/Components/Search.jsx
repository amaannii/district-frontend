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
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  const showNotification = (message, type = "success") => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

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
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setShowMobileProfile(true);

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
        showNotification("Request sent successfuly", "success");
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
      showNotification("Remove connection ", "error");
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
    <div className="flex flex-col lg:flex-row bg-gradient-to-b from-black to-neutral-900 text-white w-full min-h-screen overflow-hidden">
      {/* LEFT SECTION - SEARCH & USERS LIST */}
      <div className="w-full lg:w-[320px] xl:w-[350px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-gray-800/50 flex flex-col bg-black/30 backdrop-blur-sm">
        <div className="p-4 sm:p-5 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
          <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Search
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2.5 sm:p-3 pl-10 rounded-lg bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#879F00] transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ></svg>
          </div>

          <div className="flex justify-between items-center mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm text-gray-400 font-medium">
              {search ? "Search Results" : "Recent Searches"}
            </span>

            {recentUsers.length > 0 && !search && (
              <button
                className="text-[#879F00] text-xs sm:text-sm hover:text-[#9fb800] transition-colors"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#879F00]/30 scrollbar-track-transparent px-4 pb-6">
          {listToShow.length > 0 ? (
            <div className="space-y-1">
              {listToShow.map((user) => (
                <div
                  key={user._id}
                  className="group flex items-center justify-between py-2 px-2 hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
                >
                  <div
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2  transition-all overflow-hidden">
                        <img
                          src={user.img || profile}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = profile)}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {!search && (
                    <button
                      onClick={() => handleDeleteRecent(user._id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-all"
                      title="Remove from recent"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg
                className="w-12 h-12 text-gray-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                {search ? "No users found" : "No recent searches"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PROFILE SECTION - DESKTOP */}
      <div className="hidden lg:block flex-1 overflow-y-auto bg-gradient-to-b from-black to-neutral-900">
        {selectedUser ? (
          <div className="w-full flex flex-col items-center p-6 sm:p-8 lg:p-10 text-center animate-fadeIn">
            {/* Profile Header with Background */}
            <div className="relative w-full max-w-3xl mb-6">
              <div className="absolute inset-0 rounded-2xl"></div>
              <div className="relative p-6 rounded-2xl border border-neutral-800/50">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full  transition-all overflow-hidden mb-4">
                      <img
                        src={selectedUser.img || profile}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = profile)}
                      />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold mb-1">
                    {selectedUser.name}
                  </h2>
                  <p className="text-sm text-[#879F00] mb-3">
                    @{selectedUser.username}
                  </p>

                  {selectedUser.bio && (
                    <p className="text-gray-300 text-sm max-w-md mb-4 px-4">
                      {selectedUser.bio}
                    </p>
                  )}

                  {/* Stats Cards */}
                  <div className="flex gap-4 sm:gap-6 mb-5">
                    {[
                      { label: "Posts", value: selectedUser.post?.length || 0 },
                      {
                        label: "Connected",
                        value: selectedUser.connectedCount || 0,
                      },
                      {
                        label: "Connecting",
                        value: selectedUser.connectingCount || 0,
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg px-4 py-2 min-w-[80px]"
                      >
                        <p className="text-lg font-bold text-[#879F00]">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-200">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (connecting || requested) {
                        setShowRemoveModal(true);
                      } else {
                        handleRequest();
                      }
                    }}
                    className={`relative group overflow-hidden px-8 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 ${
                      connecting
                        ? "bg-[#4a5218] hover:bg-[#5a6820]"
                        : requested
                          ? "bg-gray-700 hover:bg-gray-700"
                          : "bg-[#879F00] hover:bg-[#9fb800]"
                    }`}
                  >
                    <span className="relative z-10">
                      {connecting
                        ? "Connected"
                        : requested
                          ? "Requested"
                          : "Connect"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-semibold text-white">Posts</h3>
                <span className="text-sm text-gray-400">
                  {selectedUser.post?.length || 0} total
                </span>
              </div>

              {selectedUser.post && selectedUser.post.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedUser.post.map((post, index) => (
                    <div
                      key={index}
                      className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => fetchFullPost(post._id)}
                    >
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-800/30 rounded-xl p-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-600 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-400">No posts available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-700 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">Search and select a user</p>
              <p className="text-gray-600 text-sm mt-2">
                to view their profile
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE USER PROFILE MODAL */}
      {showMobileProfile && selectedUser && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 overflow-y-auto animate-fadeIn">
          <div className="min-h-screen p-4 sm:p-6">
            {/* Header with Close Button */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 -mx-4 px-4 py-3 flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                onClick={() => {
                  setShowMobileProfile(false);
                  setSelectedUser(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-[#879F00]/30 overflow-hidden">
                  <img
                    src={selectedUser.img || profile}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = profile)}
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-1">{selectedUser.name}</h2>
              <p className="text-sm text-[#879F00] mb-3">
                @{selectedUser.username}
              </p>

              {selectedUser.bio && (
                <p className="text-gray-400 text-sm max-w-md mb-4 px-4">
                  {selectedUser.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-4 mb-5">
                <div className="bg-neutral-800/50 rounded-lg px-4 py-2 min-w-[70px]">
                  <p className="text-lg font-bold text-[#879F00]">
                    {selectedUser.post?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg px-4 py-2 min-w-[70px]">
                  <p className="text-lg font-bold text-[#879F00]">
                    {selectedUser.connectedCount || 0}
                  </p>
                  <p className="text-xs text-gray-400">Connected</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg px-4 py-2 min-w-[70px]">
                  <p className="text-lg font-bold text-[#879F00]">
                    {selectedUser.connectingCount || 0}
                  </p>
                  <p className="text-xs text-gray-400">Connecting</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (connecting || requested) {
                    setShowRemoveModal(true);
                  } else {
                    handleRequest();
                  }
                }}
                className={`w-[160px] py-2.5 rounded-lg font-medium transition-all ${
                  connecting
                    ? "bg-[#4a5218] hover:bg-[#5a6820]"
                    : requested
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-[#879F00] hover:bg-[#9fb800]"
                }`}
              >
                {connecting ? "Connected" : requested ? "Requested" : "Connect"}
              </button>

              {/* Posts Grid */}
              <div className="w-full mt-6">
                <h3 className="text-left text-sm font-semibold text-gray-400 mb-3">
                  Posts
                </h3>
                {selectedUser.post && selectedUser.post.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUser.post.map((post, index) => (
                      <div
                        key={index}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => {
                          setShowMobileProfile(false);
                          fetchFullPost(post._id);
                        }}
                      >
                        <img
                          src={post.image}
                          alt="post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No posts available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE CONNECTION MODAL */}
      {showRemoveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
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

            <h3 className="text-lg font-semibold mb-2 text-white">
              {connecting ? "Remove Connection?" : "Remove Request?"}
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              {connecting
                ? "This will remove the user from your connections."
                : "This will cancel your connection request."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveRequest}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4 animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPost(null)}
          ></div>

          <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-neutral-900 rounded-xl shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="sticky top-2 right-2 float-right z-10 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors"
            >
              ✕
            </button>

            <div className="px-2 pb-2">
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

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="chaotic-orbit"></div>
        </div>
      )}

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

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Search;
