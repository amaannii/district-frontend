import axios from "axios";
import { useEffect, useState } from "react";

function Userprofile({ selectedUsername }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!selectedUsername) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");

        // Fetch user profile
        const response = await axios.post(
          "http://localhost:3001/user/selecteduser",
          { username: selectedUsername },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const user = response.data.user || response.data;
        setUserData(user);

        // Fetch connection status
        const statusRes = await axios.get(
          `http://localhost:3001/user/connection-status/${selectedUsername}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (statusRes.data.status === "connected") setConnecting(true);
        else if (statusRes.data.status === "requested") setRequested(true);

        // Set number of connections
        setConnectionsCount(user.connections?.length || 0);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [selectedUsername]);

  const handleRequest = async () => {
    if (!userData) return;
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        "http://localhost:3001/user/request",
        { username: userData.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setRequested(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleRemoveRequest = async () => {
    if (!userData) return;
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        "http://localhost:3001/user/remove-connection",
        { username: userData.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConnecting(false);
      setRequested(false);
      setShowRemoveModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data: {error.message}</div>;
  if (!userData) return <div>No user selected</div>;

  return (
    <div className="flex flex-col items-center p-6 sm:p-10 text-center overflow-auto  scrollbar-hide">
      {/* Profile Image */}
      <div >

      <img
        src={userData.img}
        alt={userData.name}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-4"
      />
      </div>

      {/* Username and Name */}
      <h2 className="text-lg sm:text-xl mb-2 break-words">
        <strong>@{userData.username}</strong>
        <br />
        {userData.name}
      </h2>

      {/* Bio */}
      {userData.bio && <p className="text-gray-400 mb-4">{userData.bio}</p>}

      {/* Connections and Posts Info */}
      <div className="flex gap-8 mb-4 text-sm text-gray-300">
  <span>
    <strong>{userData.post?.length || 0}</strong> posts
  </span>

  <span>
    <strong>{userData.connected?.length || 0}</strong> connected
  </span>

  <span>
    <strong>{userData.connecting?.length || 0}</strong> connecting
  </span>
</div>

      {/* Connect / Requested / Connected Button */}
      <button
        onClick={() => {
          if (connecting || requested) setShowRemoveModal(true);
          else handleRequest();
        }}
        className={`h-[36px] w-[140px] sm:w-[160px] text-white rounded-md mb-6
          ${connecting ? "bg-[#4a5218]" : requested ? "bg-gray-600" : "bg-[#879F00]"}
        `}
      >
        {connecting ? "Connected" : requested ? "Requested" : "Connect"}
      </button>

      <hr className="w-full mb-6 border-gray-700" />

      {/* Posts Grid */}
      {userData.post?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-5xl mx-auto">
          {userData.post.map((post, index) => (
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
        <p className="text-gray-500">No posts available</p>
      )}

      {/* Remove Request / Connection Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-black border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
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
    </div>
  );
}

export default Userprofile;