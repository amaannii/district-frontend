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
  const [loading, setloading] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");

    setloading(true)
    if (stored) setRecentUsers(JSON.parse(stored));
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
    const fetchusers = async () => {
      const res = await axios.get("http://localhost:3001/user/allusers");

    if (stored) {
      setRecentUsers(JSON.parse(stored));
    }

    const fetchUsers = async () => {
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
      setloading(false);
 

    };

    fetchUsers();
  }, []);

  /* ================= SAVE RECENTS ================= */
  useEffect(() => {
    localStorage.setItem(
      "recentUsers",
      JSON.stringify(recentUsers)
    );
  }, [recentUsers]);

  /* ================= SEARCH FILTER ================= */
  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SELECT USER ================= */
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    setRecentUsers((prev) => {
      const filtered = prev.filter(
        (u) => u._id !== user._id
      );
      return [user, ...filtered].slice(0, 6);
    });

    setSearch("");
  };

  /* ================= DELETE SINGLE ================= */
  const handleDeleteRecent = (id) => {
    setRecentUsers((prev) =>
      prev.filter((user) => user._id !== id)
    );
  };

  /* ================= CLEAR ALL ================= */
  const handleClearAll = () => {
    setRecentUsers([]);
    localStorage.removeItem("recentUsers");
  };

  /* ================= SEND REQUEST ================= */
  const handleRequest = async () => {
    try {
      const token = localStorage.getItem("userToken");


  const handlerequest = async () => {
    setloading(true)
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
    if (response.data.success == true) {
      alert("request send successfully");
    } else {
      alert("request failed");

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
      } else {
        alert("Request failed");
      }
    } catch (error) {
      console.error(error);

    }
  };

  const listToShow = search ? searchResults : recentUsers;

  return (
    <div className="flex h-screen text-white bg-black">
      {/* ================= LEFT SIDE ================= */}
      <div className="w-[350px] p-4 border-r border-gray-700 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Search
        </h1>

        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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

        {listToShow.length > 0 ? (
          listToShow.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between py-3 hover:bg-gray-800 rounded px-2"
            >
              <div
                onClick={() =>
                  handleSelectUser(user)
                }
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={user.img}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>

              {!search && (
                <button
                  onClick={() =>
                    handleDeleteRecent(
                      user._id
                    )
                  }
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            {search
              ? "No users found"
              : "No recent searches"}
          </p>
        )}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 flex justify-center items-center overflow-y-auto">
        {selectedUser ? (
          <div className="w-full min-h-full flex flex-col items-center p-10 text-center">
            <img
              src={selectedUser.img}
              alt={selectedUser.name}
              className="w-28 h-28 rounded-full mb-4 object-cover"
            />

            <h2 className="text-xl mb-4">
              <strong>
                @{selectedUser.username}
              </strong>
              <br />
              {selectedUser.name}
            </h2>

            <button
              onClick={handleRequest}
              className="h-[35px] w-[160px] text-white rounded-md bg-[#879F00] mb-6"
            >
              Connect
            </button>

            <hr className="w-full mb-6 border-gray-700" />

            <div className="flex justify-center gap-20 mb-6">
              <button
                onClick={() =>
                  setActiveTab("posts")
                }
                className={
                  activeTab === "posts"
                    ? "border-b-2 border-white"
                    : "opacity-50"
                }
              >
                <img
                  className="h-6 w-5"
                  src={post}
                  alt=""
                />
              </button>

              <button
                onClick={() =>
                  setActiveTab("saved")
                }
                className={
                  activeTab === "saved"
                    ? "border-b-2 border-white"
                    : "opacity-50"
                }
              >
                <img
                  className="h-6 w-7"
                  src={saved}
                  alt=""
                />
              </button>
            </div>

            {selectedUser.post &&
            selectedUser.post.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-w-[90%] mx-auto w-full">
                {selectedUser.post.map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img.image}
                      alt="post"
                      className="w-full h-[250px] object-cover"
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center flex-1 w-full">
                <p className="text-gray-500">
                  No posts available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <p className="text-gray-500 text-center">
              Search and select a user
            </p>
          </div>
        )}
        {loading && (
          <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center ">
            <div
              className="chaotic-orbit
       "
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
