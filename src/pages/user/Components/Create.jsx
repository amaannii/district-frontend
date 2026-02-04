import { useState } from "react";
import uploadIcon from "../../../assets/images/icons8-gallery-48.png";
import Home from "./Home";
import axios from "axios";

function Create() {
  const [isOpen, setIsOpen] = useState(true);
  const [post, setpost] = useState(uploadIcon);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadpost,setuploadpost]=useState("")

const handlepost = async (file) => {
  if (!file) return;

  setLoading(true);

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "newuploads");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();

    if (result.secure_url) {
      setpost(result.secure_url);
    }
  } catch (error) {
    console.error("Image upload failed", error);
  } finally {
    setLoading(false);
  }
};



const handlesubmit = async () => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await axios.post(
      "http://localhost:3001/user/posting",
      {
        image: post,
        caption: description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setIsOpen(false);
      setpost(uploadIcon);
      setDescription("");
    }
  } catch (error) {
    console.error("Error uploading post:", error);
  }
};

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handlepost(file);
  };


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handlepost(file);
  };

  return (
    <>
      <div className="relative w-full h-full text-white play-regular">
        {/* Home UI */}
        <Home />

        {/* Overlay + Center Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 rounded-3xl">
            {/* Modal */}
            <div className="bg-[#0f0f0f] w-[420px] rounded-2xl shadow-2xl relative">
              {/* Header */}
              <div className="border-b border-gray-700 text-center py-3 font-semibold bg-[#879F00] rounded-t-2xl">
                Create new post
              </div>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-3 text-gray-300 hover:text-white text-xl"
              >
                ×
              </button>

              {/* Content */}
              <div className="flex flex-col items-center p-4">
                {post === uploadIcon ? (
                  /* BEFORE IMAGE UPLOAD */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-600 rounded-lg w-full h-64
                      flex flex-col items-center justify-center hover:border-gray-400 transition"
                  >
                    <img
                      src={uploadIcon}
                      alt="upload"
                      className="h-14 w-14 mb-4"
                    />
                    <p className="text-gray-400 mb-4">Drag photos here</p>

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
                      className="bg-[#879F00] px-4 py-2 rounded hover:opacity-90"
                    >
                      Select from computer
                    </button>
                  </div>
                ) : (
                  /* AFTER IMAGE UPLOAD */
                  <div className="w-full space-y-4">
                    {/* Image Preview */}
                    <img
                      src={post}
                      alt="preview"
                      className="w-full h-60 object-cover rounded-lg"
                    />

                    {/* Description */}
                    <textarea
                      placeholder="Write a caption..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white resize-none"
                      rows={3}
                    />

                    {/* Upload Button */}
                    <button
                      className="w-full bg-[#879F00] py-2 rounded font-semibold hover:opacity-90"
                      onClick={handlesubmit} >
                      Upload Post
                    </button>
                  </div>
                )}
                {loading && <p className="text-gray-400">Uploading...</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Create;
