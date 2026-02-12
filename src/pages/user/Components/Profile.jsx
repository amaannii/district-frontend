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
        console.error("Error fetching user details:", error);
      } finally {
        setloading(false);
      }
    };

    fetchUserDetails();
  }, [editprofile]);

  /* ---------------- DELETE POST ---------------- */
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.delete(`http://localhost:3001/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setposts(posts.filter((post) => post._id !== postId));
      setselectedPost(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ---------------- EDIT POST ---------------- */
  const handleEditPost = async (post) => {
    const newCaption = prompt("Edit caption:", post.caption);
    if (!newCaption) return;

    try {
      const token = localStorage.getItem("userToken");

      await axios.put(
        `http://localhost:3001/update-post/${post._id}`,
        { caption: newCaption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPosts = posts.map((p) =>
        p._id === post._id ? { ...p, caption: newCaption } : p
      );

      setposts(updatedPosts);
      setselectedPost({ ...post, caption: newCaption });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>

      <div className="flex play-regular h-screen w-full bg-black text-white play-regular">

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
                <p className="font-semibold">
                  {posts.length}
                </p>
                <p className="text-xs text-gray-400">posts</p>
              </div>

              <div>
                <p className="font-semibold">{connected}</p>
                <p className="text-xs text-gray-400">connected</p>
              </div>

              <div>
                <p className="font-semibold">{connecting}</p>
                <p className="text-xs text-gray-400">connecting</p>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex justify-center border-t border-gray-700 pt-4 mb-6 gap-40">
            <button onClick={() => setActiveTab("posts")}>
              <img className="h-6 w-5" src={post} alt="" />
            </button>

            <button onClick={() => setActiveTab("saved")}>
              <img className="h-6 w-7" src={saved} alt="" />
            </button>
          </div>

          {/* POSTS GRID */}
          <div className="grid grid-cols-3 gap-5 max-w-[90%] mx-auto">
            {(activeTab === "posts" ? posts : savedPosts).map(
              (img, index) => (
                <img
                  key={index}
                  src={activeTab === "posts" ? img.image : img}
                  alt="post"
                  className="w-full h-[400px] object-cover cursor-pointer"
                  onClick={() =>
                    activeTab === "posts" &&
                    setselectedPost(img)
                  }
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
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

              <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={userdetails.img || profile}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="user"
                  />
                  <span className="font-semibold">
                    {userdetails.username}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleEditPost(selectedPost)
                    }
                    className="text-blue-400 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeletePost(selectedPost._id)
                    }
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
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
