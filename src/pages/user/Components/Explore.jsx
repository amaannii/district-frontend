import { useEffect, useState } from "react";
import axios from "axios";
function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setloading] = useState(false);

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
    <div className="min-h-screen w-full bg-black text-white p-2">
      {/* MASONRY GRID */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-1">
        {posts.map((post, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <img
              src={post.image}
              alt="post"
              className="w-full "
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
    </div>
  );
}

export default Explore;
