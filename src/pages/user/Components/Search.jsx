import axios from "axios";
import React, { useEffect, useState } from "react";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import post from "../../../assets/images/icons8-menu-50.png";

function Search() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Load recent users + Fetch all users
  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");
    if (stored) {
      setRecentUsers(JSON.parse(stored));
    }

    const storedRequests = localStorage.getItem("requestedUsers");
    if (storedRequests) {
      setRequestedUsers(JSON.parse(storedRequests));
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3001/user/allusers");
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

  // Save recent users
  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  // Search filter
  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(search.toLowerCase()),
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
    if (!selectedUser || requestedUsers.includes(selectedUser._id)) {
      return; // Prevent sending again
    }

    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:3001/user/request",
        { username: selectedUser.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
     

        const updatedRequests = [...requestedUsers, selectedUser._id];
        setRequestedUsers(updatedRequests);
        localStorage.setItem("requestedUsers", JSON.stringify(updatedRequests));

        setRequested(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveRequest = async () => {
  try {
    const token = localStorage.getItem("userToken");

    // OPTIONAL: If backend delete route exists
    await axios.post(
      "http://localhost:3001/user/remove-request",
      { username: selectedUser.username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  } catch (error) {
    console.log(error);
  }

  // Remove locally
  const updated = requestedUsers.filter(
    (id) => id !== selectedUser._id
  );

  setRequestedUsers(updated);
  localStorage.setItem("requestedUsers", JSON.stringify(updated));

  setShowRemoveModal(false);
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
                    <p className="text-xs text-gray-400">@{user.username}</p>
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
              onClick={() => {
                if (requestedUsers.includes(selectedUser._id)) {
                  setShowRemoveModal(true); // Show popup
                } else {
                  handleRequest();
                }
              }}
              className={`h-[35px] w-[160px] text-white rounded-md mb-6 ${
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
                    {selectedUser.post.map((img, index) => (
                      <img
                        key={index}
                        src={img.image}
                        alt="post"
                        className="w-full h-[250px] object-cover"
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
        {showRemoveModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-black border border-gray-700 rounded-xl p-6 w-[350px] text-center">
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
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-70">
          <div className="chaotic-orbit"></div>
        </div>
      )}
      
    </div>
  );
}

export default Search;
