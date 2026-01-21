import React, { useState } from "react";
import Sidebar from "./Sidebar";

// Sample images for posts and saved posts (replace with your own)
import post1 from "../assets/images/Kovalam.jpeg";
import post2 from "../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import post3 from "../assets/images/download (11).jpeg";
import img2 from "../assets/images/download.jpeg";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  // Sample data
  const posts = [];
  const savedPosts = [post2, post3, post1];

  return (
    <div className="flex h-screen w-full bg-black text-white play-regular">
      <Sidebar />

      <div className="flex-1 overflow-y-auto px-8 py-6 ">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-4xl">
              <img className="w-25 h-20 rounded-full" src={img2} alt="" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">john_jony__</h1>
              <p className="text-sm text-gray-400">john</p>
            </div>
          </div>

          {/* Settings Button */}
          <button className="text-white text-xl hover:text-gray-400">
            ⚙️
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4 text-center">
          <div>
            <p className="font-semibold">0</p>
            <p className="text-sm text-gray-400">posts</p>
          </div>
          <div>
            <p className="font-semibold">10</p>
            <p className="text-sm text-gray-400">connected</p>
          </div>
          <div>
            <p className="font-semibold">10</p>
            <p className="text-sm text-gray-400">connecting</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mb-6">
          <button className="bg-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-700 ">
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-700 text-gray-400 mb-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-2 text-center ${
              activeTab === "posts" ? "text-white border-b-2 border-white" : ""
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 text-center ${
              activeTab === "saved" ? "text-white border-b-2 border-white" : ""
            }`}
          >
            Saved
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 gap-1 w-[250px]">
          {(activeTab === "posts" ? posts : savedPosts).map((img, index) => (
            <img
              key={index}
              src={img} 
              alt="post"
              className="w-full h-32 object-cover rounded-sm cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
