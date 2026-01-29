import { useEffect, useState } from "react";
import axios from "axios";

function Explore() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/user/posts/explore", // ✅ FIXED
      );
      setPosts(res.data);
    } catch (error) {
      console.error("Explore fetch error:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white">
      {/* GRID */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {posts.map((post, index) => (
          <div key={index} className="cursor-pointer">
            <img
              src={post.image}
              alt="post"
              className="w-full h-[250px] object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
