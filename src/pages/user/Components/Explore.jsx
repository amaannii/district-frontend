import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Components/PostCard";
import profile from "../../../assets/images/icons8-profile-50.png";

function Explore({ setSelectedUsername, setActive }) {
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
        setLoading(true);
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`http://localhost:3001/user/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPost(res.data.post);
    } catch (err) {
      console.error(err);
    }finally {
        setLoading(false);
      }
  };

  return (
   <div className="min-h-screen w-full bg-black text-white px-1 sm:px-3 md:px-6 py-3 overflow-y-auto scrollbar-hide overflow-x-hidden">
      {/* ===== Masonry Grid ===== */}
      <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-5 gap-2 sm:gap-3">
        {posts.map((post, index) => (
          <div key={index} className="mb-2 sm:mb-3 break-inside-avoid group">
            <img
              src={post.image||profile}
              alt="post"
              onClick={() => fetchFullPost(post._id)}
              className="w-full cursor-pointer rounded-md sm:rounded-lg
           transition duration-300
           group-hover:opacity-80 object-cover"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 ">
          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPost(null)}
          ></div>

          <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* PostCard */}
           <div className="max-h-[85vh] overflow-y-auto scrollbar-hide px-2 sm:px-0">
              <PostCard
                data={selectedPost}
                setSelectedUsername={setSelectedUsername}
                setActive={setActive}
              />
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center  z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default Explore;
