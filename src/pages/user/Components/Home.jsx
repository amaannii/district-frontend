import React, { useEffect, useState } from "react";
import MiniChatBox from "./MiniChatBox";
import Messages from "./Messages";
import PostCard from "./PostCard";
import axios from "axios";
import Profile from "./Profile";
import defaultProfile from "../../../assets/images/icons8-profile-50.png";
import API from "../../../API/Api";

function Home({ setSelectedUsername, setActive, openChat }) {
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
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        const [feedRes, notesRes, imageRes] = await Promise.all([
          API.get("/user/feed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/user/notes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/user/image", {
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
    if (!newNote.trim()) return;

    try {
      const token = localStorage.getItem("userToken");
      setLoading(true);
      const res = await API.post(
        "/user/note",
        { note: newNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setMyNote(newNote);
        setShowAddNoteModal(false);
        setNewNote("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const token = localStorage.getItem("userToken");
      setLoading(true);
      const res = await API.delete("/user/note", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMyNote("");
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = () => {
    setNewNote(myNote);
    setShowAddNoteModal(true);
  };

  /* ================= HOME VIEW ================= */
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white">
      {/* MAIN CONTENT */}
      <div className="flex-1 w-full max-w-xl sm:max-w-2xl mx-auto ">
        {/* NOTES SECTION - ENHANCED */}
       <div className="min-h-[100px] sm:min-h-[140px] mt-22 sm:mt-6 gap-10 border-b border-neutral-800/50 ">
  <div className="flex items-center justify-between mb-2 px-1">
    <h2 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">
      Notes
    </h2>
    {myNote && (
      <button
        onClick={handleUpdateNote}
        className="text-[10px] sm:text-xs text-[#879F00] hover:text-[#9fb800] transition-colors"
      >
        Edit
      </button>
    )}
  </div>

  <div className="flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide snap-x">
    {/* MY NOTE CARD */}
    <div className="flex flex-col items-center w-[70px] sm:w-[85px] shrink-0 snap-start group">
      <div className="relative">
        <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full  overflow-hidden">
          <img
            src={image || defaultProfile}
            alt="Your profile"
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>
        
        {!myNote ? (
          <button
            onClick={() => setShowAddNoteModal(true)}
            className="absolute -bottom-0 -right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#879F00] hover:bg-[#9fb800] text-white font-bold flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="bg-[#879F00] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              {myNote.length > 10 ? `${myNote.substring(0, 10)}...` : myNote}
            </span>
          </div>
        )}
      </div>
      
      <p className="text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4 font-medium">
        You
      </p>
    </div>

    {/* CONNECTED NOTES */}
    {notes
      .filter((n) => n.note && n.note.trim() !== "")
      .map((n) => (
        <div
          key={n._id}
          className="flex flex-col items-center w-[70px] sm:w-[85px] shrink-0 snap-start group cursor-pointer"
          onClick={() => {
            setSelectedUsername(n.username);
            setActive("UPROFILE");
          }}
        >
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-[#879F00]/50 ring-offset-2 ring-offset-black overflow-hidden">
              <img 
                src={n.img || defaultProfile} 
                alt={n.username}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => (e.target.src = defaultProfile)}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="bg-[#879F00] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                {n.note.length > 10 ? `${n.note.substring(0, 10)}...` : n.note}
              </span>
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-gray-300 mt-3 sm:mt-4 font-medium truncate max-w-[70px] sm:max-w-[85px]">
            {n.username}
          </p>
        </div>
      ))}
  </div>
</div>

        {/* POSTS SECTION */}
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] pb-10">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <div className="chaotic-orbit"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 text-center px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm sm:text-base mb-2">No posts yet</p>
              <p className="text-gray-600 text-xs sm:text-sm">Connect with others to see their posts</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
              {posts.map((p) => (
                <PostCard
                  key={p._id}
                  data={p}
                  user={user}
                  setActive={setActive}
                  setSelectedUsername={setSelectedUsername}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ABOUT ACCOUNT MODAL */}
      {showAboutAccount && selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 w-[90%] max-w-sm rounded-xl p-5 sm:p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">About this account</h3>
              <button 
                onClick={() => setShowAboutAccount(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 bg-neutral-800/50 rounded-lg">
              <img
                src={selectedPost.userId?.img || defaultProfile}
                alt="Profile"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                onError={(e) => (e.target.src = defaultProfile)}
              />
              <div>
                <p className="font-semibold text-sm sm:text-base">{selectedPost.userId?.username}</p>
                <p className="text-xs text-gray-400">Joined {new Date(selectedPost.userId?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs sm:text-sm text-gray-300">
                <span className="text-gray-500">Posts:</span> {selectedPost.userId?.postCount || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-300">
                <span className="text-gray-500">Connected:</span> {selectedPost.userId?.connectedCount || 0}
              </p>
            </div>

            <button
              onClick={() => {
                setShowAboutAccount(false);
                setSelectedUsername(selectedPost.userId?.username);
                setActive("UPROFILE");
              }}
              className="w-full bg-[#879F00] hover:bg-[#9fb800] text-white py-2 rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              View Profile
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT NOTE MODAL */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 w-[90%] max-w-sm rounded-xl p-5 sm:p-6 border border-neutral-800">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">
              {myNote ? "Edit your note" : "Add a note"}
            </h3>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-neutral-800 text-white text-sm sm:text-base p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#879F00] resize-none"
              rows={3}
              maxLength={50}
              autoFocus
            />
            
            <div className="text-right text-xs text-gray-500 mb-4">
              {newNote.length}/50
            </div>

            <div className="flex gap-3">
              <button
                onClick={addMyNote}
                disabled={!newNote.trim()}
                className={`flex-1 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  newNote.trim()
                    ? 'bg-[#879F00] hover:bg-[#9fb800] text-white'
                    : 'bg-neutral-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {myNote ? "Update" : "Add"}
              </button>
              
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setNewNote("");
                }}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>

            {myNote && (
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setShowDeleteModal(true);
                }}
                className="w-full mt-3 text-red-500 hover:text-red-400 text-xs sm:text-sm transition-colors"
              >
                Delete note
              </button>
            )}
          </div>
        </div>
      )}

      {/* DELETE NOTE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 w-[90%] max-w-sm rounded-xl p-5 sm:p-6 text-center border border-neutral-800">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Delete note?</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteNote}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDEBAR - CHAT */}
      <div className="w-[280px] xl:w-[320px] hidden lg:block border-l border-neutral-800/50 bg-gradient-to-b from-black to-neutral-900">
        <div className="sticky top-20">
          <MiniChatBox openChat={openChat} />
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="chaotic-orbit"></div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Home;