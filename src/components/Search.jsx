import React from "react";
import logoo from "../assets/images/logoo.jpg";
import home from "../assets/images/icons8-home-24.png";
import search from "../assets/images/download search.png";

import { useState } from "react";
import Sidebar from "./Sidebar";

function Search() {
  const users = [
    {
      id: 1,
      name: "Lunor",
      username: "lunor.sab",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=1",
      bio: "Frontend Developer",
    },
    {
      id: 2,
      name: "Feylo",
      username: "feylo",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=2",
      bio: "React Developer",
    },
    {
      id: 3,
      name: "Yuvoh",
      username: "yuvoh",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=3",
      bio: "UI Designer",
    },
    {
      id: 4,
      name: "Kavro",
      username: "kavro",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=4",
      bio: "Backend Developer",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black text-white play-regular">
      {/* LEFT SIDE - SEARCH */}
      <Sidebar/>
      <div className="w-[350px] p-4 border-r border-gray-700">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>

        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-white text-black mb-4"
        />

        <div className="flex justify-between mb-2">
          <span className="text-sm">Recent</span>
          <span
            className="text-green-500 text-sm cursor-pointer"
            onClick={() => setSearch("")}
          >
            Clear all
          </span>
        </div>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-800 rounded"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">
                {user.username}.{user.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE - PROFILE */}
      <div className="flex-1 flex items-center justify-center">
        {selectedUser ? (
          <div className="text-center">
            <img
              src={selectedUser.image}
              className="w-28 h-28 rounded-full mx-auto mb-4"
              alt=""
            />
            <h2 className="text-2xl font-semibold">
              {selectedUser.name}
            </h2>
            <p className="text-gray-400">@{selectedUser.username}</p>
            <p className="mt-3">{selectedUser.bio}</p>
          </div>
        ) : (
          <p className="text-gray-500">Search and select a user</p>
        )}
      </div>
    </div>
  );
}

export default Search;

