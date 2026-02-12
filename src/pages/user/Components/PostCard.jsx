import React, { useState ,useEffect,useRef} from "react";
import axios from "axios";

import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import send from "../../../assets/images/icons8-sent-50.png";
import bookmark from "../../../assets/images/icons8-bookmark-30.png";
import moreIcon from "../../../assets/images/icons8-more-30.png";

/* ---------------- POST CARD ---------------- */



function PostCard({ data, onShare, onPostDeleted, onPostUpdated }) {
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setloading] = useState(false);
   const isOwner = loggedUser?._id === data.userId?._id;
  // ✅ server-driven state
  const [liked, setLiked] = useState(data.isLiked || false);
  const [likeCount, setLikeCount] = useState(data.likes || 0);
  const [comments, setComments] = useState(data.comments || []);
   const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(data.caption || "");

  const menuRef = useRef();

  /* ---------------- CLOSE MENU ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ❤️ LIKE POST */
  const handleLike = async () => {
    try {
      setloading(true)
      const res = await axios.post(
        "/like-post",
        { postId: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLiked(res.data.isLiked);
        setLikeCount(res.data.likes);
      }
    } catch (err) {


   console.error(err);
    }finally {
      setloading(false);

      console.error(err);

    }
  };

  /* 💬 ADD COMMENT */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setloading(true)
      const res = await axios.post(
        "/add-comment",
           { postId: data._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setComments(res.data.comments);
        setCommentText("");
      }
    } catch (err) {



       console.error(err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    try {
      await axios.delete(`/delete-post/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onPostDeleted?.(data._id);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `/update-post/${data._id}`,
        { caption: editedCaption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setIsEditing(false);
        onPostUpdated?.(res.data.post);
      }
    } catch (err) {
      console.error(err);
    }finally {
      setloading(false);

      console.error(err);
    }
  };



  /* ---------------- UPDATE ---------------- */

  return (
    <div className="border-b border-neutral-800 mb-6">

      {/* HEADER */}
       <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={data.userId?.img}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold">
            {data.userId?.username}
          </span>
        </div>

        {/* 3 DOTS ONLY IF OWNER */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <img
              src={moreIcon}
              className="w-5 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-gray-800 rounded shadow-lg flex flex-col z-20">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="px-3 py-2 text-left text-white hover:bg-gray-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 text-left text-red-500 hover:bg-gray-700 text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* POST IMAGE */}
      <img
        src={data.image}
        alt=""
        className="w-full max-h-[450px] object-cover"
      />

      {/* CAPTION */}
       <div className="px-6 py-2 text-gray-300">
        <span className="font-semibold mr-2">
          {data.userId?.username}
        </span>

        {isEditing ? (
          <div className="flex gap-2 mt-2">
            <input
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="flex-1 bg-neutral-800 p-2 rounded text-white"
            />
            <button
              onClick={handleUpdate}
              className="text-blue-500"
            >
              Save
            </button>
          </div>
        ) : (
          data.caption
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-5 items-center">

          {/* LIKE */}
          <div className="flex items-center gap-1">
            <img
              src={liked ? heartRed : heart}
              className="w-5 cursor-pointer"
              onClick={handleLike}
            />
            <span className="text-xs text-gray-400">
              {likeCount}
            </span>
          </div>

          {/* COMMENT */}
          <img
            src={commentIcon}
            className="w-5 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          />

          {/* SHARE */}
          <img
            src={send}
            className="w-5 cursor-pointer"
            onClick={() => onShare?.(data)}
          />
        </div>

        {/* SAVE */}
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
            <div key={i} className="text-sm text-gray-300 mb-1">
              <span className="font-semibold mr-2">
                {c.username}
              </span>
              {c.text}
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-neutral-800 p-2 rounded"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleComment}
              className="text-blue-500"
            >
              Post
            </button>
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
    </div>
  );
}

export default PostCard;
