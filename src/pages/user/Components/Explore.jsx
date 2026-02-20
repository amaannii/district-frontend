import { useEffect, useState } from "react";
import axios from "axios";
function Explore() {
  const [posts, setPosts] = useState([]);



  const [loading, setloading] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null); // ✅ NEW



  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      setloading(true)
      const res = await axios.get("http://localhost:3001/user/posts/explore");
      setPosts(res.data);
    } catch (error) {
      console.error("Explore fetch error:", error);
    }finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full play-regular scrollbar-hide overflow-scroll bg-black text-white p-2">
      {/* MASONRY GRID */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-1">
        {posts.map((post, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <img
              src={post.image}
              alt="post"
               onClick={() => setSelectedPost(post)} // ✅ CLICK TO OPEN
              className="w-full cursor-pointer"
            />
          </div>
        ))}
      </div>


       {loading && (
        <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center ">
          <div
            className="chaotic-orbit
       "
          ></div>
          </div>
       )}



      {/* ================= POST MODAL ================= */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          
          <div className="relative max-w-4xl w-full flex justify-center">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            {/* Post Image */}
            <img
              src={selectedPost.image}
              alt="full-post"
              className="max-h-[90vh] object-contain"
            />

          </div>
        </div>
      )}

    </div>
  );
}

export default Explore;
