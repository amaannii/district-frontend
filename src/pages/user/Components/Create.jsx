import { useState } from "react";
import uploadIcon from "../../../assets/images/icons8-gallery-48.png";
import Home from "./Home";
import axios from "axios";

function Create() {
  const [isOpen, setIsOpen] = useState(true);
  const [post, setPost] = useState(uploadIcon);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
        { method: "POST", body: data }
      );

      const result = await res.json();

      if (result.secure_url) {
        setPost(result.secure_url);
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:3001/user/posting",
        {
          image: post,
          caption: description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setIsOpen(false);
        setPost(uploadIcon);
        setDescription("");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handlePost(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    handlePost(e.target.files[0]);
  };

  return (
    <div className="relative w-full h-screen text-white">
      <Home />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6">
          
          {/* Modal */}
          <div className="bg-[#0f0f0f] w-full max-w-md sm:max-w-lg md:max-w-xl 
                          rounded-2xl shadow-2xl relative 
                          max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="border-b border-gray-700 text-center py-3 font-semibold 
                            bg-[#879F00] rounded-t-2xl text-sm sm:text-base">
              Create new post
            </div>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-3 text-gray-200 hover:text-white text-xl"
            >
              ×
            </button>

            {/* Content */}
            <div className="flex flex-col items-center p-4 sm:p-6">

              {post === uploadIcon ? (
                /* BEFORE UPLOAD */
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-600 
                             rounded-lg w-full h-52 sm:h-64
                             flex flex-col items-center justify-center 
                             hover:border-gray-400 transition text-center"
                >
                  <img
                    src={uploadIcon}
                    alt="upload"
                    className="h-12 w-12 sm:h-14 sm:w-14 mb-4"
                  />

                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    Drag photos here
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    id="fileUpload"
                    hidden
                    onChange={handleFileSelect}
                  />

                  <button
                    onClick={() =>
                      document.getElementById("fileUpload").click()
                    }
                    className="bg-[#879F00] px-4 py-2 rounded 
                               hover:opacity-90 text-sm sm:text-base"
                  >
                    Select from computer
                  </button>
                </div>
              ) : (
                /* AFTER UPLOAD */
                <div className="w-full space-y-4">

                  {/* Image Preview */}
                  <img
                    src={post}
                    alt="preview"
                    className="w-full max-h-72 sm:max-h-80 
                               object-cover rounded-lg"
                  />

                  {/* Caption */}
                  <textarea
                    placeholder="Write a caption..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-gray-700 
                               rounded-lg p-3 text-white resize-none 
                               text-sm sm:text-base"
                    rows={3}
                  />

                  {/* Upload */}
                  <button
                    className="w-full bg-[#879F00] py-2 sm:py-3 
                               rounded font-semibold hover:opacity-90 
                               text-sm sm:text-base"
                    onClick={handleSubmit}
                  >
                    Upload Post
                  </button>
                </div>
              )}

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-black/70 
                                flex items-center justify-center rounded-2xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#879F00]"></div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;