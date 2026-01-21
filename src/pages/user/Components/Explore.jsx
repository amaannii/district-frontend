
import post1 from "../../../assets/images/download (3).jpeg";
import post2 from "../../../assets/images/download (4).jpeg";
import post3 from "../../../assets/images/download (5).jpeg";
import post4 from "../../../assets/images/download (7).jpeg";
import post5 from "../../../assets/images/download (8).jpeg";
import post6 from "../../../assets/images/download (9).jpeg";
import post7 from "../../../assets/images/download (10).jpeg";
import post8 from "../../../assets/images/yeslydimate.jpeg";
import post9 from "../../../assets/images/rome.jpeg";
import { useState } from "react";

function Explore() {
  const posts = [post1, post2, post3, post4, post5, post6, post7, post8, post9];

  // State for modal
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % posts.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <>
     <div className="h-screen w-full bg-black flex text-white play-regular">
     <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="rounded-md overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
            >
              <img
                src={post}
                alt={`post-${index}`}
                className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal} >
          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={closeModal}   >
            &times;
          </button>

          <button
            className="absolute left-5 text-white text-3xl font-bold"
            onClick={showPrev} >
            &#10094;
          </button>

          <img
            src={posts[selectedIndex]}
            alt="selected"
            className="max-w-full max-h-full rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()} />

          <button
            className="absolute right-5 text-white text-3xl font-bold"
            onClick={showNext}
          >
            &#10095;
          </button>
        </div>
    )}
    </div>
        
    </>
  )
}

export default Explore