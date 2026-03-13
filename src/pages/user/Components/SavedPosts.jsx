import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import API from "../../../API/Api";

function SavedPosts({ setSelectedUsername, setActive }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/saved-posts", {
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
    fetchuser();
  }, [token]);

  const fetchuser = async () => {
    const token = localStorage.getItem("userToken");
    try {
      setLoading(true);

      const response = await API.post(
        "/user/userdetails",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(response.data.user.username);

      setUser(response.data.user.username); // ✅ store user in state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <h2 className="text-2xl font-semibold mb-8">Saved Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">No saved posts yet.</p>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {posts.map((p) => (
            <PostCard
              key={p._id}
              data={p}
              setSelectedUsername={setSelectedUsername}
              setActive={setActive}
              user={user}
            />
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
