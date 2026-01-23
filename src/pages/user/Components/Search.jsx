import React, { useState } from "react";

function Search() {
  const users = [
    {
      id: 1,
      name: "Lunor",
      username: "lunor.sab",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Feylo",
      username: "feylo",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Yuvoh",
      username: "yuvoh",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Kavro",
      username: "kavro",
      status: "connected",
      image: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  const filteredUsers = search
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSelectUser = (user) => {
    setSelectedUser(user);

    setRecentUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev;
      return [user, ...prev];
    });
  };

  const handleClearAll = () => {
    setSearch("");
    setSelectedUser(null);
    setRecentUsers([]);
  };

  const listToShow = search ? filteredUsers : recentUsers;

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
          <span className="text-sm">
            {search ? "Results" : "Recent"}
          </span>
          {recentUsers.length > 0 && (
            <span
              className="text-green-500 text-sm cursor-pointer"
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
                src={user.image}
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
      <div className="flex-1 flex items-center justify-center">
        {selectedUser ? (
          <div className="text-center">
            <img
              src={selectedUser.image}
              alt={selectedUser.name}
              className="w-28 h-28 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold">
              {selectedUser.name}
            </h2>
            <p className="text-gray-400">@{selectedUser.username}</p>
          </div>
        ) : (
          <p className="text-gray-500">Search and select a user</p>
        )}
      </div>
    </>
  );
}

export default Search;
