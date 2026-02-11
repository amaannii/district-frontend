import axios from "axios";
import React, { useEffect, useState } from "react";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import post from "../../../assets/images/icons8-menu-50.png";

function Search() {
  const [users, setusers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentUsers");
    setloading(true)
    if (stored) setRecentUsers(JSON.parse(stored));
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
    const fetchusers = async () => {
      const res = await axios.get("http://localhost:3001/user/allusers");


      if (res.data.success == true) {
        setusers(res.data.users);
      } else {
        alert("users not found");
      }
      setloading(false);
 


    };
    fetchusers();
  }, []);

  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);

    setRecentUsers((prev) => {
      const filtered = prev.filter((u) => u.id !== user.id);
      return [user, ...filtered].slice(0, 6);
    });

    setSearch("");
  };

  const handleClearAll = () => {
    setRecentUsers([]);
    localStorage.removeItem("recentUsers");
  };


  /* 🔹 Decide list */
  const listToShow = search ? searchResults : recentUsers;

  const handlerequest = async () => {
  try {
    setloading(true);

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
      alert("Request sent successfully ✅");
    } else {
      alert("Request failed ❌");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setloading(false);
  }
};

  return (
    <>
      {/* LEFT SIDE */}
      <div className="w-[350px] p-4 border-r border-gray-700 h-full">
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

        {listToShow.length > 0 ? (
          listToShow.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-800 rounded"
            >
              <img
                src={user.img}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">
                  @{user.username} · {user.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            {search ? "No users found" : "No recent searches"}
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex justify-center overflow-scroll scrollbar-hide">
        {selectedUser ? (
          <div className="text-center h-[100vh] p-10 w-[100%]">
            <img
              src={selectedUser.img}
              alt={selectedUser.name}
              className="w-28 h-28 rounded-full mx-auto mb-4"
            />

            <h2 className="text-xl  ">
              {" "}
              <strong>@{selectedUser.username} </strong>
              <br />
              {selectedUser.name}
            </h2>

            <div className="text-sm text-gray-400 h-[100px] items-center flex justify-center ">
              <button
                onClick={handlerequest}
                className="h-[30px] w-[150px] text-white rounded-md  bg-[#879F00]"
              >
                connect
              </button>
            </div>
            <hr />

            <div className="flex justify-center border-t border-gray-700 pt-4 mb-6 gap-40">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-10 py-2 ${
                  activeTab === "posts"
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                <img className="h-6 w-5" src={post} alt="" />
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-10 py-2 ${
                  activeTab === "saved"
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                <img className="h-6 w-7" src={saved} alt="" />
              </button>
            </div>

            {activeTab === "posts" && selectedUser.post.length === 0 ? (
              <div className="flex flex-col items-center  text-gray-500 mt-17">
                <div className="text-5xl mb-3">
                  <img className="h-20 w-20" src={profile} alt="" />
                </div>
                <p className="text-4xl">Photos of you</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-w-[90%]   mx-auto">
                {(activeTab === "posts" ? selectedUser.post : savedPosts).map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img.image}
                      alt="post"
                      className="w-[100%] h-[300px] object-cover cursor-pointer"
                      onClick={() => setSelectedUser(img)} // 👈 ADD THIS
                    />
                  ),
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Search and select a user</p>
        )}
        {loading && (
          <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center ">
            <div
              className="chaotic-orbit
       "
            ></div>
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
    </>
  );
}

export default Search;
