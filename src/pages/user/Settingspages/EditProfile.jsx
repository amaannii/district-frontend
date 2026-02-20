import axios from "axios";
import React, { useEffect, useState } from "react";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userdetails, setuserdetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);
  const [deleted, setdeleted] = useState(0);
  const [user, setUser] = useState({});
  const [uploadshow, setuploadshow] = useState(false);
  const [savedGender, setSavedGender] = useState("");
  const [savedBio, setSavedBio] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");

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

        // ✅ ADD THESE LINES
        setGender(user.gender || "");
        setSavedGender(user.gender || "");

        setBio(user.bio || "");
        setSavedBio(user.bio || "");

        setName(user.name || "");
        setSavedName(user.name || "");
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

        setShowModal(false);
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
          setShowModal(false);
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

  const handleSaveGender = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        "http://localhost:3001/user/updateGender",
        { gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setSavedGender(gender); // ✅ update button state
        alert("Gender saved successfully ✅");
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Error saving gender ❌");
    }
  };

  const handleSaveBio = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/updateBio",
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setSavedBio(bio);
        alert("Bio saved successfully ✅");
      }
    } catch (error) {
      console.log(error);
      alert("Error saving bio ❌");
    }
  };

  const handleSaveName = async () => {
  try {
    const token = localStorage.getItem("userToken");

    const res = await axios.post(
      "http://localhost:3001/user/updateName",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setSavedName(name);
      setShowNameModal(false);
      alert("Name updated successfully ✅");
    }
  } catch (error) {
    console.log(error);
    alert("Error updating name ❌");
  }
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
            <div className="flex items-center gap-2">
  <p className="text-gray-500 text-xs">{savedName}</p>

  {/* Pen Button */}
  <button
    onClick={() => setShowNameModal(true)}
    className="text-gray-400 hover:text-black transition"
  >
    🖊️
  </button>
</div>

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
        {/* Bio */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Bio
          </label>

          <input
            type="text"
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 250) {
                setBio(e.target.value);
              }
            }}
            placeholder="Bio (max 250 characters)"
            className="w-full px-5 py-3 rounded-xl text-sm bg-black border border-gray-700"
          />

          {/* Character Counter */}
          <p
            className={`text-xs mt-2 ${
              bio.length === 250 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {bio.length}/250 characters
          </p>

          {/* Save Button */}
          <button
            onClick={handleSaveBio}
            disabled={bio === savedBio || bio.length === 0}
            className={`mt-4 px-5 py-1 rounded-xl text-white
      ${bio === savedBio ? "bg-[#879F00]" : "bg-[#879F00]"}`}
          >
            {savedBio === ""
              ? "Save Bio"
              : bio !== savedBio
                ? "Update Bio"
                : "change bio"}
          </button>
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-5 py-3 rounded-xl text-sm bg-black border border-gray-700"
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleSaveGender}
            disabled={gender === savedGender}
            className={`mt-4 px-6 py-2 rounded-xl text-white
    ${gender === savedGender ? "bg-[#879F00]" : "bg-[#879F00]"}`}
          >
            {savedGender === ""
              ? "Save Gender"
              : gender !== savedGender
                ? "Update Gender"
                : "change gender"}
          </button>
        </div>
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
          <div className="bg-white justify-between flex flex-col  items-center p-6 rounded-xl w-[350px] shadow-lg text-center">
            <h2 className="text-xl font-semibold text-black mb-4">
              Upload Image
            </h2>
            <div className="w-[200px] justify-between flex ">
              {/* Upload Button */}
              <label
                htmlFor="fileUpload"
                className="cursor-pointer bg-black  text-white px-4 py-2 rounded-lg"
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
                className=" text-sm text-black hover:text-black"
              >
                Cancel
              </button>
            </div>
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
      {/* ================= NAME MODAL ================= */}
{showNameModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-[#111] w-[420px] rounded-2xl p-6 border border-gray-700 shadow-xl">

      {/* Title */}
      <h2 className="text-center text-lg font-semibold mb-5 text-white">
        Update Name
      </h2>

      {/* Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white"
        placeholder="Enter new name"
      />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        {/* Cancel */}
        <button
          onClick={() => setShowNameModal(false)}
          className="px-5 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600"
        >
          Cancel
        </button>

        {/* Save */}
        <button
          onClick={handleSaveName}
          disabled={name === savedName || name.length === 0}
          className="px-5 py-2 rounded-xl bg-[#879F00] text-white hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default EditProfile;
