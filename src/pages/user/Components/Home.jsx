import React, { useEffect, useState } from "react";
import MiniChatBox from "./MiniChatbox";
import Messages from "./Messages";
import PostCard from "./PostCard";
import axios from "axios";
import profile from "../../../assets/images/p1.jpg";
import profile1 from "../../../assets/images/download.jpeg";
import post from "../../../assets/images/download (13).jpeg";
import post1 from "../../../assets/images/Lashing art Cafe kochi.jpeg";
import post2 from "../../../assets/images/download (14).jpeg";
import post3 from "../../../assets/images/PAYANA.jpeg";
import profile2 from "../../../assets/images/images.jpeg";
import profile3 from "../../../assets/images/images (1).jpeg";
import profile4 from "../../../assets/images/Veste Tapisserie Roxane 29 - Marine Guillemette.jpeg";

const postsData = [
  { id: 1, username: "akshay__", avatar: profile, image: post, likes: 128 },
  { id: 2, username: "john_dev", avatar: profile2, image: post1, likes: 87 },
  { id: 3, username: "emma.codes", avatar: profile3, image: post2, likes: 203 },
  { id: 4, username: "ui.daily", avatar: profile4, image: post3, likes: 66 },
];
/* DATA */
const notesData = [
  { id: 1, note: "Busy", avatar: profile4 },
  { id: 2, note: "At work", avatar: profile2 },
  { id: 3, note: "Coffee", avatar: profile3 },
  { id: 4, note: "Goodbye", avatar: profile },
];

/* ---------------- HOME ---------------- */

function Home({ openChat }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [shareNote, setShareNote] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [showAboutAccount, setShowAboutAccount] = useState(false);
  const [posts, setPosts] = useState([]);
  const [image, setimage] = useState();
  const [myNote, setMyNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchimage = async () => {
      setloading(true);
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get("http://localhost:3001/user/image", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setimage(res.data.image); // ✅ correct
        }
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };

    const fetchFeed = async () => {
      setloading(true);
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get("http://localhost:3001/user/feed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Feed:", res.data);

        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };

    const fetchNotes = async () => {
      setloading(true);
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get("http://localhost:3001/user/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setMyNote(res.data.myNote.note);
          setNotes(res.data.connectedNotes);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };

    fetchFeed();
    fetchimage();
    fetchNotes();
  }, []);

  const addMyNote = async () => {
    const note = prompt("Enter note");
    if (!note) return;

    const token = localStorage.getItem("userToken");

    const res = await axios.post(
      "http://localhost:3001/user/note",
      { note },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.data.success) {
      setMyNote(note);
    }
  };

  return (
    <div className="flex w-full play-regular min-h-screen bg-black text-white">
      <div className="flex-1 max-w-2xl mx-auto">
        {/* NOTES */}
        <div className="h-[130px] px-6 border-b border-neutral-800">
          <div className="flex gap-12 overflow-x-auto mt-6 scrollbar-hide">
            {/* MY NOTE */}
            <div className="flex flex-col items-center w-[85px] shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <img src={image} className="w-full h-full object-cover" />

                {!myNote && (
                  <button
                    onClick={addMyNote}
                    className="absolute bottom-2 right-1 w-4 h-4 rounded-full bg-[#879F00] text-xs"
                  >
                    +
                  </button>
                )}
              </div>

              {myNote && (
                <div
                  onClick={() => {
                    setMyNote("");
                    setNotes((prev) => prev.filter((n) => !n.isMine));
                  }}
                  className="bg-[#879F00] text-white text-[11px] px-3 py-1 rounded-full mt-1 cursor-pointer"
                >
                  {myNote}
                </div>
              )}
            </div>

            {/* OTHER NOTES */}
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

                  <p className="text-xs text-gray-300 mt-1">{n.username}</p>

                  <div className="bg-[#879F00] text-[11px] px-3 py-1 rounded-full mt-1">
                    {n.note}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* POSTS */}
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-130px)] pb-10">
          <div>
            {posts.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No posts from connected users
              </p>
            ) : (
              posts.map((p) => <PostCard key={p._id} data={p} />)
            )}
          </div>
        </div>
      </div>

      {/* POST OPTIONS */}
      {showPostOptions && selectedPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-[280px] rounded-lg overflow-hidden">
            <button
              onClick={() => {
                setShowPostOptions(false);
                setShowAboutAccount(true);
              }}
              className="w-full py-3 hover:bg-neutral-800"
            >
              About this account
            </button>

            <button
              onClick={() => setShowPostOptions(false)}
              className="w-full py-3 text-red-400 hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ABOUT ACCOUNT */}
      {showAboutAccount && selectedPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-[360px] rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold">About this account</h3>
              <button onClick={() => setShowAboutAccount(false)}>✕</button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={`http://localhost:5000/${data.userId.img}`}
                className="w-8 h-8 rounded-full"
              />

              <span>{data.userId.username}</span>

              <div>
                <p className="font-semibold">{selectedPost.username}</p>
                <p className="text-xs text-gray-400">Public profile</p>
                <p className="text-xs text-gray-400 mt-1">Not connected</p>
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

      {/* SHARE MODAL */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-[550px] h-[400px] rounded-lg flex flex-col">
            <div className="p-4 border-b border-neutral-700">Share to</div>
            <div className="flex-1 overflow-y-auto p-4">
              <Messages sharedPost={sharePost} sharedNote={shareNote} />
            </div>
            <div className="p-3 border-t border-neutral-700">
              <button
                onClick={() => {
                  setShowShareOptions(false);
                  setSharePost(null);
                  setShareNote(null);
                }}
                className="w-full bg-[#879F00] py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-[320px] hidden lg:block">
        <MiniChatBox openChat={openChat} />
      </div>
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

export default Home;
