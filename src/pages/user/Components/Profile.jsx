import React, { useEffect, useState } from "react";
import post1 from "../../../assets/images/Kovalam.jpeg";
import post2 from "../../../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import post3 from "../../../assets/images/download (11).jpeg";
import settings from "../../../assets/images/icons8-settings-50.png";
import post from "../../../assets/images/icons8-menu-50.png";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import profile from "../../../assets/images/profile.png";
import axios from "axios";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userdetails, setuserdetails] = useState({});
  const [editprofile, seteditprofile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setposts] = useState([]);
  const [selectedPost, setselectedPost] = useState(null);
  const [connected, setconnected] = useState(0);
  const [connecting, setconnecting] = useState(0);
  const savedPosts = [post2, post3, post1];
  const [showConnections, setShowConnections] = useState(false);
  const [connectionType, setConnectionType] = useState("");
  const [connectionList, setConnectionList] = useState([]);
  const [loading, setloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [editedCaption, setEditedCaption] = useState("");


  /* ---------------- FETCH USER ---------------- */
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
          }
        );

        const user = response.data.user;

        setuserdetails(user);
        setposts(user.post || []);
        setconnected(user.connected?.length || 0);
        setconnecting(user.connecting?.length || 0);
        setSelectedImage(user.img);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };

    fetchUserDetails();
  }, [editprofile]);

  /* ---------------- PROFILE IMAGE UPLOAD ---------------- */
  const handleimage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
      setloading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
        { method: "POST", body: data }
      );

      const result = await res.json();
      if (result.secure_url) {
        setSelectedImage(result.secure_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const handlesubmit = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("userToken");

      await axios.post(
        "http://localhost:3001/user/upload",
        { img: selectedImage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      seteditprofile(false);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  /* ---------------- DELETE POST ---------------- */
  const handleDeletePost = async (postId) => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await axios.delete(
      `http://localhost:3001/user/delete-post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // remove from UI immediately
      setposts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );

      setselectedPost(null);
    }
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
  }
};


  /* ---------------- EDIT POST ---------------- */
 const handleUpdatePost = async () => {
  try {
    const token = localStorage.getItem("userToken");

    await axios.put(
      `http://localhost:3001/user/update-post/${selectedPost._id}`,
      { caption: editedCaption },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedPosts = posts.map((p) =>
      p._id === selectedPost._id
        ? { ...p, caption: editedCaption }
        : p
    );

    setposts(updatedPosts);
    setselectedPost({
      ...selectedPost,
      caption: editedCaption,
    });

    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};


  return (
    <>
      <div className="flex h-screen w-full bg-black text-white">

        <div className="flex-1 overflow-y-auto px-10 py-8">

          {/* SETTINGS */}
          <div className="flex justify-end mb-6">
            <img className="h-6 cursor-pointer" src={settings} alt="" />
          </div>

          {/* PROFILE */}
          <div className="flex flex-col items-center text-center">
            <div
              onClick={() => seteditprofile(true)}
              className="w-20 h-20 rounded-full bg-white overflow-hidden mb-3 cursor-pointer"
            >
              <img
                src={userdetails.img || profile}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-xl font-semibold">
              {userdetails.username}
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              {userdetails.name}
            </p>

            <div className="flex gap-10 mb-5">
              <div>
                <p className="font-semibold">{posts.length}</p>
                <p className="text-xs text-gray-400">posts</p>
              </div>

              <div
                onClick={() => {
                  setConnectionType("connected");
                  setConnectionList(userdetails.connected || []);
                  setShowConnections(true);
                }}
              >
                <p className="font-semibold cursor-pointer">
                  {connected}
                </p>
                <p className="text-xs text-gray-400">connected</p>
              </div>

              <div
                onClick={() => {
                  setConnectionType("connecting");
                  setConnectionList(userdetails.connecting || []);
                  setShowConnections(true);
                }}
              >
                <p className="font-semibold cursor-pointer">
                  {connecting}
                </p>
                <p className="text-xs text-gray-400">connecting</p>
              </div>
            </div>
          </div>

          {/* POSTS GRID */}
          <div className="grid grid-cols-3 gap-5 max-w-[90%] mx-auto">
            {posts.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt="post"
                className="w-full h-[400px] object-cover cursor-pointer"
                onClick={() => setselectedPost(img)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#0f0f0f] w-[800px] h-[500px] rounded-xl flex">

            <div className="w-1/2">
              <img
                src={selectedPost.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-1/2 p-4 flex flex-col">

              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="font-semibold">
                  {userdetails.username}
                </span>

                <div className="flex gap-4">
                 <button
  onClick={() => {
    setIsEditing(true);
    setEditedCaption(selectedPost.caption);
  }}
  className="text-blue-400 text-sm"
>
  Edit
</button>


                <button
  onClick={() => handleDeletePost(selectedPost._id)}
  className="text-red-500 text-sm"
>
  Delete
</button>

                </div>
              </div>
<div className="flex-1 text-sm mt-3">
  {isEditing ? (
    <>
      <textarea
        value={editedCaption}
        onChange={(e) => setEditedCaption(e.target.value)}
        className="w-full bg-black border border-gray-600 p-2 rounded text-white"
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={handleUpdatePost}
          className="bg-[#879F00] px-4 py-1 rounded text-sm"
        >
          Update
        </button>

        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-600 px-4 py-1 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </>
  ) : (
    selectedPost.caption
  )}
</div>


              <button
                onClick={() => setselectedPost(null)}
                className="mt-4 bg-[#879F00] py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL */}
      {editprofile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#0f0f0f] p-6 rounded-xl text-center w-[300px]">
            <h2 className="mb-4 font-semibold">
              Upload profile photo
            </h2>

            <input type="file" onChange={handleimage} />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => seteditprofile(false)}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlesubmit}
                className="bg-[#879F00] px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONNECTION MODAL */}
      {showConnections && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#0f0f0f] w-[500px] p-4 rounded-xl">
            <h2 className="text-center font-semibold mb-4 capitalize">
              {connectionType}
            </h2>

            {connectionList.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2 border-b border-gray-700"
              >
                <img
                  src={user.img || profile}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-sm">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.name}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowConnections(false)}
              className="w-full mt-4 bg-[#879F00] py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
