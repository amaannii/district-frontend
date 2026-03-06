import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

function SavedPosts() {
  const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/user/saved-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <h2 className="text-2xl font-semibold mb-8">Saved Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">No saved posts yet.</p>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {posts.map((p) => (
            <PostCard key={p._id} data={p} />
          ))}
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
