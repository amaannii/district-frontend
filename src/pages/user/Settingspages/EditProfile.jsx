import axios from "axios";
import React, { useEffect, useState } from "react";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Female");
  const [showModal, setShowModal] = useState(false);
  const [userdetails, setuserdetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);
  const [deleted, setdeleted] = useState(0);
  const [user, setUser] = useState({});
  const [uploadshow, setuploadshow] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setloading(true);
        const token = localStorage.getItem("userToken");

        const response = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const user = response.data.user;

        setuserdetails(user);
        setposts(user.post || []);
        setSelectedImage(user.img);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setloading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handledelete = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:3001/user/deleted",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log("Image deleted successfully ✅");

        // Update UI immediately
        setUser((prev) => ({
          ...prev,
          img: "",
        }));

        setShowModal(false)
      }
    } catch (error) {
      console.error("Error deleting image ❌", error);

      alert("Failed to delete image. Try again!");
    }
  };

  const handleuploadimg = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
      setloading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
        { method: "POST", body: data },
      );

      const result = await res.json();
      const token = localStorage.getItem("userToken");
      if (result.secure_url) {
        const res = await axios.post(
          "http://localhost:3001/user/upload",
          { img: result.secure_url },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data.success == true) {
          setuploadshow(false);
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setloading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleuploadimg(file);
  };

  return (
    <div className="w-full text-white play-regular relative">
      {/* Title */}
      <h1 className="text-xl font-bold mb-13">Edit Profile</h1>

      {/* Profile Card */}
      <div className="bg-white text-black rounded-xl p-2 flex items-center justify-between w-[600px] shadow-lg">
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <img
            src={userdetails.img}
            alt="profile"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h2 className="font-semibold text-sm">{userdetails.username}</h2>
            <p className="text-gray-500 text-xs">{userdetails.name}</p>
          </div>
        </div>

        {/* Change Photo Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Change Photo
        </button>
      </div>

      {/* Form Section */}
      <div className="mt-5 w-[600px] flex flex-col gap-6">
        {/* Bio */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Bio
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full px-5 py-3 rounded-xl text-sm bg-black border border-gray-700 focus:outline-none focus:border-[#879F00]"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-5 py-3 rounded-xl text-sm bg-black border border-gray-700 focus:outline-none focus:border-[#879F00]"
          >
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>

        {/* Submit */}
        <button className="w-[140px] bg-[#879F00] text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">
          Submit
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#111] w-[480px] rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
            {/* Title */}
            <h2 className="text-center text-lg font-semibold py-5 border-b border-gray-700">
              Change Profile Photo
            </h2>

            {/* Upload */}
            <button
              onClick={() => setuploadshow(true)}
              className="w-full py-4 text-[#879F00] font-semibold border-b border-gray-700 hover:bg-white/5 transition"
            >
              Upload Photo
            </button>

            {/* Remove */}
            <button
              onClick={handledelete}
              className="w-full py-4 text-red-500 font-semibold border-b border-gray-700 hover:bg-white/5 transition"
            >
              Remove Current Photo
            </button>

            {/* Cancel */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 text-white font-medium hover:bg-white/5 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {uploadshow && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    
    {/* Modal Box */}
    <div className="bg-white p-6 rounded-xl w-[350px] shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">
        Upload Image
      </h2>

      {/* Upload Button */}
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Choose File
      </label>

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        id="fileUpload"
        hidden
        onChange={handleFileSelect}
      />

      {/* Close Button */}
      <button
        onClick={() => setuploadshow(false)}
        className="mt-4 text-sm text-gray-500 hover:text-black"
      >
        Cancel
      </button>
    </div>
  </div>
)}
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

export default EditProfile;
