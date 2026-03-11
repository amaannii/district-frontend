import axios from "axios";
import React, { useEffect, useState } from "react";
import profile from "../../../assets/images/icons8-user-100.png";
import Swal from "sweetalert2";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userdetails, setuserdetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setposts] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handledelete = async () => {
    try {
        setLoading(true);
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
        Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Image Deleted",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

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
    }finally {
        setLoading(false);
      }
    
  };

  const handleuploadimg = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
       setLoading(true);
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
                Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Profile photo updated",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

        }
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
        setLoading(false);
    }
 
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleuploadimg(file);
  };

  const handleSaveGender = async () => {
    try {
        setLoading(true);
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
  setSavedGender(gender);


  Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Profile photo updated",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
}

      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Error saving gender ❌");
    }finally {
        setLoading(false);
      }
  };

  const handleSaveBio = async () => {
    try {
      const token = localStorage.getItem("userToken");
  setLoading(true);
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
     
  Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Your bio was saved successfully",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
      }
    } catch (error) {
      console.log(error);
      alert("Error saving bio ❌");
    }finally {
        setLoading(false);
      }
  };

  const handleSaveName = async () => {
    try {
      const token = localStorage.getItem("userToken");
  setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/user/updateName",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setSavedName(name);
        setShowNameModal(false);
     
  Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Name Updated",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
      }
    } catch (error) {
      console.log(error);
      alert("Error updating name ❌");
    }finally {
        setLoading(false);
      }
  };

  return (
    <div className="w-full max-w-xl text-white play-regular mx-auto px-4 sm:px-6">
      {/* Title */}
      <h1 className="text-lg sm:text-xl font-bold mb-8 sm:mb-10">
  Edit Profile
</h1>

      {/* Profile Card */}
     <div className="text-black bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full shadow-lg">
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <img
            src={userdetails.img || profile}
            alt="profile"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
          />

          <div>
           <h2 className="font-semibold text-sm sm:text-base">{userdetails.username}</h2>
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
         className="bg-black text-white px-4 sm:px-5 py-2 rounded-lg text-sm w-full sm:w-auto hover:bg-gray-800 transition"
        >
          Change Photo
        </button>
      </div>

      {/* Form Section */}
      <div className="mt-6 sm:mt-8 w-full flex flex-col gap-6">
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
  className="w-full px-4 sm:px-5 py-3 rounded-xl text-sm bg-black border border-gray-700 focus:outline-none focus:border-[#879F00]"
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
            className={`mt-4 w-full sm:w-auto px-5 py-2 rounded-xl text-white bg-[#879F00] hover:opacity-90 transition
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
  className="w-full px-4 sm:px-5 py-3 rounded-xl text-sm bg-black border border-gray-700 focus:outline-none focus:border-[#879F00]"
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
            className={`mt-4 w-full sm:w-auto px-6 py-2 rounded-xl text-white bg-[#879F00] hover:opacity-90 transition
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
          <div className="bg-[#111] w-[92%] sm:w-[90%] max-w-md rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
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
          <div className="bg-white justify-between flex flex-col  items-center p-6 rounded-xl w-[90%] max-w-sm shadow-lg text-center">
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
          <div className="bg-[#111] w-[90%] max-w-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
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
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center  z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}

    </div>
  );
}

export default EditProfile;
