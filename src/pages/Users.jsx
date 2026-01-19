import { useState } from "react";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "Amani", email: "amani@gmail.com", role: "Admin" },
    { id: 2, name: "Ali", email: "ali@gmail.com", role: "User" },
    { id: 3, name: "Sara", email: "sara@gmail.com", role: "Manager" },
  ];

  return (
    <div className="flex h-screen p-6 gap-6 bg-gray-100">
      {/* Left Side */}
      <div className="w-1/3 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedUser?.id === user.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Right Side */}
      <div className="w-2/3 bg-white rounded-lg shadow p-6">
        {!selectedUser ? (
          <p className="text-gray-500 text-lg">
            Select a user to see details
          </p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedUser.name}
            </h2>

            <p className="mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
          
          </>
        )}
      </div>
    </div>
    
  );
};

export default Users;

