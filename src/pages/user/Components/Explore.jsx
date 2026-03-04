import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Components/PostCard";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/user/posts/explore");
      console.log("Explore posts:", res.data);
      setPosts(res.data);
    } catch (error) {
      console.error("Explore fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullPost = async (postId) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`http://localhost:3001/user/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPost(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white px-2 sm:px-4 md:px-6 py-3">

      {/* ===== Masonry Grid ===== */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2">
        {posts.map((post, index) => (
          <div
            key={index}
            className="mb-2 break-inside-avoid group"
          >
            <img
              src={post.image}
              alt="post"
              onClick={() => fetchFullPost(post._id)}
              className="w-full cursor-pointer rounded-lg 
                         transition duration-300 
                         group-hover:opacity-80"
            />
          </div>
        ))}
      </div>

      {/* ===== Loading Overlay ===== */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#879F00]"></div>
        </div>
      )}

      {/* ===== Post Modal with PostCard ===== */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">

          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPost(null)}
          ></div>

          <div className="relative w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg"
            >
              ✕
            </button>

            {/* PostCard */}
            <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
              <PostCard data={selectedPost} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Explore;