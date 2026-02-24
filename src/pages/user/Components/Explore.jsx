import { useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get(
        "http://localhost:3001/user/posts/explore"
      );
      setPosts(res.data);
    } catch (error) {
      console.error("Explore fetch error:", error);
    } finally {
      setLoading(false);
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
              onClick={() => setSelectedPost(post)}
              className="w-full cursor-pointer rounded-lg 
                         transition duration-300 
                         group-hover:opacity-80"
            />
          </div>
        ))}

      </div>

      {/* ===== Loading Overlay ===== */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 
                        flex justify-center items-center z-40">
          <div className="animate-spin rounded-full 
                          h-12 w-12 border-t-2 
                          border-[#879F00]"></div>
        </div>
      )}

      {/* ===== Post Modal ===== */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 
                        flex justify-center items-center 
                        z-50 p-3">

          <div className="relative w-full max-w-5xl 
                          max-h-[95vh] flex 
                          justify-center items-center">

            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 
                         text-white text-2xl 
                         hover:scale-110 transition"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedPost.image}
              alt="full-post"
              className="max-h-[90vh] w-auto 
                         object-contain 
                         rounded-lg"
            />

          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;