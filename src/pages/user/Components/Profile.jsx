import React, { useEffect, useState } from "react";
import post1 from "../../../assets/images/Kovalam.jpeg";
import post2 from "../../../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import post3 from "../../../assets/images/download (11).jpeg";
import img2 from "../../../assets/images/download.jpeg";
import settings from "../../../assets/images/icons8-settings-50.png";
import post from "../../../assets/images/icons8-menu-50.png";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import profile from "../../../assets/images/profile.png";
import axios from "axios";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userdetails, setuserdetails] = useState("");
  const [editprofile, seteditprofile] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setposts] = useState("");
  const [selectedPost, setselectedPost] = useState("");
  const [connected, setconnected] = useState(0);
  const [connecting, setconnecting] = useState(0);
  const savedPosts = [post2, post3, post1];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setuserdetails(response.data.user);
        setposts(response.data.user.post);
        setconnected(response.data.user.connected.length)
        setconnecting(response.data.user.connecting.length)
        setSelectedImage(response.data.user.img);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [editprofile]);

  const handleimage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");
    data.append("cloud_name", "dlxxxangl");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();

      if (result) {
        console.log(result.secure_url);
        setSelectedImage(result.secure_url);
      }
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const handlesubmit = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:3001/user/upload",
        { img: selectedImage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response) {
        seteditprofile(false);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  return (
    <>
      <div className="flex h-screen w-full bg-black text-white play-regular">
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="flex justify-end mb-6">
            <button className="text-xl hover:text-gray-400">
              <img className="h-6" src={settings} alt="" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div
              onClick={() => seteditprofile(true)}
              className="w-20 h-20 rounded-full bg-white overflow-hidden mb-3"
            >
              {userdetails.img ? (
                <img
                  src={userdetails.img}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="data:image/png;base64,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"
                  alt="user-female-circle"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h1 className="text-xl font-semibold">{userdetails.username}</h1>
            <p className="text-sm text-gray-400 mb-4">{userdetails.name}</p>

            <div className="flex gap-10 mb-5">
              <div>
                <p className="font-semibold">{userdetails.post?.length || 0}</p>
                <p className="text-xs text-gray-400">posts</p>
              </div>
              <div>
                <p className="font-semibold">
                  {connected}
                </p>
                <p className="text-xs text-gray-400">connected</p>
              </div>
              <div>
                <p className="font-semibold">
                  {connecting}
                </p>
                <p className="text-xs text-gray-400">connecting</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center border-t border-gray-700 pt-4 mb-6 gap-40">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-10 py-2 ${
                activeTab === "posts"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              <img className="h-6 w-5" src={post} alt="" />
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-10 py-2 ${
                activeTab === "saved"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              <img className="h-6 w-7" src={saved} alt="" />
            </button>
          </div>

          {activeTab === "posts" && posts.length === 0 ? (
            <div className="flex flex-col items-center text-gray-500 mt-17">
              <div className="text-5xl mb-3">
                <img className="h-20 w-20" src={profile} alt="" />
              </div>
              <p className="text-4xl">Photos of you</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5 max-w-[90%]  mx-auto">
              {(activeTab === "posts" ? posts : savedPosts).map(
                (img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt="post"
                    className="w-[100%] h-[400px] object-cover cursor-pointer"
                    onClick={() => setselectedPost(img)} // 👈 ADD THIS
                  />
                ),
              )}
            </div>
          )}
        </div>
        {editprofile && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#0f0f0f] rounded-xl p-6 w-[320px] text-center">
              <h2 className="text-lg font-semibold mb-4">
                Upload profile photo
              </h2>

              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-white mb-4">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={profile}
                    alt="placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="text-sm text-gray-300 mb-4"
                onChange={(e) => handleimage(e)}
              />

              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 text-sm bg-white text-black rounded"
                  onClick={() => seteditprofile(false)}
                >
                  Cancel
                </button>

                <button
                  onClick={handlesubmit}
                  className="px-4 py-2 text-sm bg-[#879F00] rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#0f0f0f] w-[800px] h-[500px] rounded-xl overflow-hidden flex">
            <div className="w-1/2 bg-black">
              <img
                src={selectedPost.image}
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-1/2 p-4 flex flex-col">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                <img
                  src={userdetails.img || profile}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="user"
                />
                <span className="font-semibold">{userdetails.username}</span>
              </div>

              <div className="flex-1 overflow-y-auto text-sm">
                <span className="font-semibold mr-2">
                  {userdetails.username}
                </span>
                {selectedPost.caption}
              </div>

              <button
                onClick={() => setselectedPost(null)}
                className="mt-4 bg-[#879F00] py-2 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
