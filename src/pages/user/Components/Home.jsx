import React, { useState } from "react";

/* ICONS */
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import comment from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";

/* IMAGES */
import profile from "../../../assets/images/p1.jpg";
import profile1 from "../../../assets/images/download.jpeg";
import post from "../../../assets/images/download (13).jpeg";
import post1 from "../../../assets/images/Lashing art Cafe kochi.jpeg";
import post2 from "../../../assets/images/download (14).jpeg";
import post3 from "../../../assets/images/PAYANA.jpeg";
import profile2 from "../../../assets/images/images.jpeg";
import profile3 from "../../../assets/images/images (1).jpeg";
import profile4 from "../../../assets/images/Veste Tapisserie Roxane 29 - Marine Guillemette.jpeg";

/* COMPONENTS */
import MiniChatBox from "./MiniChatbox";
import Messages from "./Messages";

/* DATA */
const notesData = [
  { id: 1, note: "Busy", avatar: profile4 },
  { id: 2, note: "At work", avatar: profile2 },
  { id: 3, note: "Coffee ", avatar: profile3 },
  { id: 4, note: "Goodbye ", avatar: profile },
];

const postsData = [
  { id: 1, username: "akshay__", avatar: profile, image: post, likes: 128 },
  { id: 2, username: "john_dev", avatar: profile2, image: post1, likes: 87 },
  { id: 3, username: "emma.codes", avatar: profile3, image: post2, likes: 203 },
  { id: 4, username: "ui.daily", avatar: profile4, image: post3, likes: 66 },
];

/* ---------------- POST CARD ---------------- */

function PostCard({ data, onOpenOptions, onShare, openChat }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  return (
    <div className="border-b border-neutral-800 mb-6">

      {/* HEADER */}
      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={data.avatar} className="w-8 h-8 rounded-full mr-1" />
          <span className="font-semibold">{data.username}</span>
        </div>

        {/* THREE DOTS */}
        <span
          className="cursor-pointer text-xl"
          onClick={() => onOpenOptions(data)}
        >
          ⋮
        </span>
      </div>

      {/* IMAGE */}
      <img src={data.image} className="w-full max-h-[430px] object-cover" />

      {/* ACTIONS */}
      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex items-center gap-1">
            <img
              src={liked ? heartRed : heart}
              className="w-5 cursor-pointer"
              onClick={() => {
                setLiked(!liked);
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
              }}
            />
            <span className="text-xs text-gray-400">{likeCount}</span>
          </div>

          <img
            src={comment}
            className="w-5 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          />

          {/* SHARE */}
          <img
            src={send}
            className="w-5 cursor-pointer"
            onClick={() => onShare(data)}
          />
        </div>

        <img
          src={bookmark}
          className={`w-5 cursor-pointer ${saved ? "" : "opacity-50"}`}
          onClick={() => setSaved(!saved)}
        />
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="px-6 pb-4">
          {comments.map((c, i) => (
            <p key={i} className="text-sm text-gray-300">{c}</p>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-neutral-800 p-2 rounded"
              placeholder="Add a comment..."
            />
            <button
              onClick={() => {
                if (!commentText.trim()) return;
                setComments([...comments, commentText]);
                setCommentText("");
              }}
              className="text-blue-500"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ openChat }) {
  const [myNote, setMyNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [showAboutAccount, setShowAboutAccount] = useState(false);

  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharePost, setSharePost] = useState(null);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">

      {/* FEED */}
      <div className="flex-1 max-w-2xl mx-auto">

        {/* NOTES */}
        <div className="h-[130px] px-6 border-b border-neutral-800">
          <div className="flex gap-12 overflow-x-auto mt-6">
            <div className="flex flex-col items-center w-[85px] shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <img src={profile1} className="w-full h-full object-cover" />
                {!myNote && (
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-xs"
                  >
                    +
                  </button>
                )}
              </div>

              {myNote && (
                <div
                  onClick={() => setMyNote("")}
                  className="bg-white text-black text-[11px] px-3 py-1 rounded-full mt-1 cursor-pointer"
                >
                  {myNote}
                </div>
              )}
            </div>

            {notesData.map((n) => (
              <div key={n.id} className="flex flex-col items-center w-[80px] shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img src={n.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="bg-neutral-800 text-[11px] px-3 py-1 rounded-full mt-1">
                  {n.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POSTS */}
        <div className="overflow-y-auto h-[calc(100vh-130px)] pb-10">
          {postsData.map((p) => (
            <PostCard
              key={p.id}
              data={p}
              openChat={openChat}
              onOpenOptions={(post) => {
                setSelectedPost(post);
                setShowPostOptions(true);
              }}
              onShare={(post) => {
                setSharePost(post);
                setShowShareOptions(true);
              }}
            />
          ))}
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
        className="w-full py-3 hover:bg-neutral-800"
      >
        Go to post
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
        <img src={selectedPost.avatar} className="w-14 h-14 rounded-full" />
        <div>
          <p className="font-semibold">{selectedPost.username}</p>
          <p className="text-xs text-gray-400">Public profile</p>
          {/* 🔹 Connection status */}
          <p className="text-xs text-gray-400 mt-1">
            {selectedPost.connected
              ? "Connected"
              : selectedPost.connecting
              ? "Connecting..."
              : "Not connected"}
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


      {/* SHARE MODAL */}
      {showShareOptions && sharePost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 ">
          <div className="bg-neutral-900 w-[550px] h-[400px] rounded-lg flex flex-col">
            <div className="p-4 border-b border-neutral-700">Share to</div>
            <div className="flex-1 overflow-y-auto p-4 ">
              <Messages sharedPost={sharePost} />
            </div>
            <div className="p-3 border-t border-neutral-700">
              <button
                onClick={() => setShowShareOptions(false)}
                className="w-full bg-blue-600 py-2 rounded gap-2"
              >
                Send
              </button>
              <button
                onClick={() => setShowShareOptions(false)}
                className="w-full bg-blue-600 py-2 rounded mt-2"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT CHAT */}
      <div className="w-[320px] hidden lg:block">
        <MiniChatBox openChat={openChat} />
      </div>
    </div>
  );
}

export default Home;
