import React, { useState } from "react";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Female");

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full text-white play-regular relative">
      {/* Title */}
      <h1 className="text-xl font-bold mb-13">Edit Profile</h1>

      {/* Profile Card */}
      <div className="bg-white text-black rounded-xl p-2 flex items-center justify-between w-[600px] shadow-lg">
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h2 className="font-semibold text-sm">john_jony__</h2>
            <p className="text-gray-500 text-xs">john</p>
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
            <button className="w-full py-4 text-[#879F00] font-semibold border-b border-gray-700 hover:bg-white/5 transition">
              Upload Photo
            </button>

            {/* Remove */}
            <button className="w-full py-4 text-red-500 font-semibold border-b border-gray-700 hover:bg-white/5 transition">
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
    </div>
  );
}

export default EditProfile;
