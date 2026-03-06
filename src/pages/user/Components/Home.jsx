import React, { useEffect, useState } from "react";
import MiniChatBox from "./MiniChatbox";
import Messages from "./Messages";
import PostCard from "./PostCard";
import axios from "axios";
import Profile from "./Profile";
import defaultProfile from "../../../assets/images/profile.png";

function Home({setSelectedUsername,setActive,openChat }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [shareNote, setShareNote] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [showAboutAccount, setShowAboutAccount] = useState(false);
 
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState();
  const [myNote, setMyNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  
  

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        const [feedRes, notesRes, imageRes] = await Promise.all([
          axios.get("http://localhost:3001/user/feed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/user/notes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/user/image", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (feedRes.data.success) {
          setPosts(feedRes.data.posts);
        }

        if (notesRes.data.success) {
          setMyNote(notesRes.data.myNote?.note || "");
          setNotes(notesRes.data.connectedNotes);
          setUser(notesRes.data.user);
        }

        if (imageRes.data.success) {
          setImage(imageRes.data.image);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= NOTES ================= */
  const addMyNote = async () => {
    const note = prompt("Enter note");
    if (!note) return;

    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/note",
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMyNote(note);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.delete(
        "http://localhost:3001/user/note",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMyNote("");
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

//   /* ================= PROFILE VIEW ================= */
//  /* ================= PROFILE VIEW ================= */
// if (active === "PROFILE" && profileData) {
//   return (
//     <div className="flex w-full min-h-screen bg-black text-white">
//       <div className="flex-1 max-w-3xl mx-auto p-6">
//         {/* Back button */}
//         <button
//           onClick={() => {
//             setActive("HOME");
//             setSelectedUserId(null);
//             setProfileData(null);
//           }}
//           className="mb-4 text-blue-400 hover:underline"
//         >
//           ← Back
//         </button>

//         {/* Profile Header */}
//         <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
//          <img
//   src={profileData.img || "/default-avatar.png"}
//   alt={profileData.username}
//   className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
// />
//           <div className="text-center sm:text-left">
//             <h2 className="text-2xl font-bold">{profileData.username}</h2>
//             {profileData.bio && (
//               <p className="text-gray-400 mt-1">{profileData.bio}</p>
//             )}
//             <p className="text-gray-400 mt-2">
//               {profileData.posts?.length || 0} posts
//             </p>
//           </div>
//         </div>

//         {/* Posts Grid */}
//         {profileData.posts?.length > 0 ? (
//           <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1">
//             {profileData.posts.map((post) => (
//               <img
//                 key={post._id}
//                 src={post.image || "/default-post.png"}
//                 alt="post"
//                 className="w-full h-32 sm:h-40 object-cover cursor-pointer hover:opacity-80 transition"
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center mt-6">No posts yet</p>
//         )}
//       </div>
//     </div>
//   );
// }







  /* ================= HOME VIEW ================= */
  return (
    <div className="flex w-full play-regular min-h-screen bg-black text-white">
      <div className="flex-1 max-w-2xl mx-auto">

        {/* NOTES */}
        <div className="h-[130px] px-6 border-b border-neutral-800">
          <div className="flex gap-12 overflow-x-auto mt-6 scrollbar-hide">

            <div className="flex flex-col items-center w-[85px] shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <img src={image||defaultProfile} className="w-full h-full object-cover bg-white" />

             
              </div>
                 {!myNote && (
                  <button
                    onClick={addMyNote}
                    className="relative left-5 bottom-4 w-5 h-5 rounded-full bg-[#879F00] text-xs font-bold cursor-pointer "
                  >
                    +
                  </button>
                )}

              {myNote && (
                <div
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-[#879F00] text-white text-[11px] px-3 py-1 rounded-full mt-1 cursor-pointer"
                >
                  {myNote}
                </div>
              )}
            </div>

            {notes
              .filter((n) => n.note && n.note.trim() !== "")
              .map((n) => (
                <div
                  key={n._id}
                  className="flex flex-col items-center w-[80px] shrink-0"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img src={n.img} className="w-full h-full object-cover" />
                  </div>

                  <p className="text-xs text-gray-300 mt-1">
                    {n.username}
                  </p>

                  <div className="bg-[#879F00] text-[11px] px-3 py-1 rounded-full mt-1">
                    {n.note}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* POSTS */}
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-130px)] pb-10">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No posts from connected users
            </p>
          ) : (
            posts.map((p) => (
              <PostCard 
  key={p._id}
  data={p}
  user={user}
  setActive={setActive}
setSelectedUsername={setSelectedUsername}
/>
            ))
          )}
        </div>
      </div>

      {/* ABOUT ACCOUNT FIXED */}
      {showAboutAccount && selectedPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-[360px] rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold">About this account</h3>
              <button onClick={() => setShowAboutAccount(false)}>✕</button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedPost.userId?.img}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {selectedPost.userId?.username}
                </p>
                <p className="text-xs text-gray-400">
                  Public profile
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutAccount(false)}
              className="w-full bg-neutral-800 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-[320px] hidden lg:block">
        <MiniChatBox openChat={openChat} />
      </div>

      {loading && (
        <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center">
          Loading...
        </div>
      )}
      {/* DELETE NOTE MODAL */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-neutral-900 w-[320px] rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold mb-4">
        Delete your note?
      </h3>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleDeleteNote}
          className="bg-red-600 px-4 py-2 rounded cursor-pointer"
        >
          Delete
        </button>

        <button
          onClick={() => setShowDeleteModal(false)}
          className="bg-neutral-700 px-4 py-2 rounded cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;