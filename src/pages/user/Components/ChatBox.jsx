import { useEffect, useRef, useState } from "react";
import socket from "../../../Socket";
import axios from "axios";
import heart from "../../../assets/images/icons8-heart-24.png";
import heartRed from "../../../assets/images/icons8-heart-24 (1).png";
import commentIcon from "../../../assets/images/icons8-comment-50.png";
import API from "../../../API/Api";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "😢",
  "😡",
  "👍",
  "🙏",
  "🔥",
  "🎉",
  "❤️",
];

function ChatBox({ district, onBack, setSelectedUsername, setActive }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentUser, setcurrentUser] = useState(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openImageMenuId, setOpenImageMenuId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const emojiRef = useRef(null);
  const menuRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const messagesEndRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= SOCKET ================= */

useEffect(() => {
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const res = await API.post(
        "/user/userdetails",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = res.data.user;
      setcurrentUser(user);
    } catch (error) {
      console.log("Error fetching notification settings ❌", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!district) return;

    try {
      setMessages([]);

      const res = await API.get(`/messages/${district}`);
      const data = res.data;

      const formatted = data.messages.map((msg) => {
        if (msg.post) {
          return {
            type: "post",
            post: msg.post,
            postOwner: msg.postOwner,
            sender: msg.sender,
            time: msg.createdAt,
          };
        }

        return {
          _id: msg._id,
          type: msg.message?.type,
          content: msg.message?.content,
          name: msg.message?.name,
          sender: msg.sender,
          time: msg.createdAt,
        };
      });

      setMessages(formatted);
    } catch (error) {
      console.log("Error fetching messages ❌", error);
    }
  };

  fetchDetails();
  fetchMessages();

  if (!district) return;

  socket.emit("joinDistrict", district);

  const receiveHandler = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        _id: msg._id,
        ...msg.message,
        sender: msg.sender,
        time: msg.createdAt,
      },
    ]);
  };

  const handleDelete = (messageId) => {
    setMessages((prev) =>
      prev.filter((m) => m._id === undefined || m._id !== messageId)
    );
  };

  socket.on("receiveMessage", receiveHandler);
  socket.on("messageDeleted", handleDelete);

  return () => {
    socket.off("receiveMessage", receiveHandler);
    socket.off("messageDeleted", handleDelete);
    socket.emit("leaveDistrict", district);
  };
}, [district, showComments, liked]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    };
    const handleoutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    scrollToBottom();
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleoutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleoutside);
    };
  }, [messages]);

  /* ================= SEND TEXT ================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    console.log(currentUser);

    socket.emit("sendMessage", {
      district,
      message: {
        type: "text",
        content: message,
      },

      sender: currentUser.name, // 🔥 important
    });

    setMessage("");
  };

  /* ================= EMOJI ================= */

  const sendEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
  };

  /* ================= IMAGE ================= */

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
      console.log("Uploading to Cloudinary...");
      setLoading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();
      console.log("Cloudinary response:", result);

      if (!result.secure_url) {
        console.log("No secure_url received");
        return;
      }

      console.log("Sending socket message...");

      socket.emit("sendMessage", {
        district,
        message: {
          type: "image",
          content: result.secure_url,
        },
        sender: currentUser?.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOCUMENT ================= */

  const sendDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "newuploads");

    try {
      setLoading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxxxangl/raw/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();

      if (!result.secure_url) return;

      socket.emit("sendMessage", {
        district,
        message: {
          type: "document",
          content: result.secure_url,
          name: file.name,
        },
        sender: currentUser?.name,
      });
    } catch (error) {
      console.error("Document upload error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!selectedPost?.post?._id) return;

      try {
        const token = localStorage.getItem("userToken");
        setLoading(true);
        const res = await API.post(
          "/user/checkisliked",
          { postId: selectedPost.post._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setLiked(res.data.isLiked);
          setLike(res.data.likes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [selectedPost?.post?._id]);

  /* ================= AUDIO ================= */

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) =>
      audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    audioChunksRef.current = [];
  };

  const sendRecording = async () => {
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      const data = new FormData();
      data.append("file", blob);
      data.append("upload_preset", "newuploads");

      try {
        setLoading(true);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dlxxxangl/video/upload",
          {
            method: "POST",
            body: data,
          },
        );

        const result = await res.json();

        if (!result.secure_url) return;

        socket.emit("sendMessage", {
          district,
          message: {
            type: "audio",
            content: result.secure_url,
          },
          sender: currentUser.name,
        });

        setRecording(false);
      } catch (error) {
        console.error("Audio upload error:", error);
      } finally {
        setLoading(false);
      }
    };
  };

  const deleteMessage = (id) => {
    console.log("Deleting id:", id);

    socket.emit("deleteMessage", {
      district,
      messageId: id,
    });

    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = blobUrl;
      a.download = "image.jpg"; // you can customize
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed ❌", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed ❌", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("Login required");

    try {
      setLoading(true);
      const res = await API.post(
        "/user/like-post",
        { postId: selectedPost.post._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLiked(res.data.isLiked);
      setLike(res.data.likes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    const token = localStorage.getItem("userToken"); // ✅ ADD THIS

    if (!token) return alert("Login required");
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(
        "/user/add-comment",
        { postId: selectedPost.post._id, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setSelectedPost((prev) => ({
          ...prev,
          post: {
            ...prev.post,
            comments: [...(prev.post.comments || []), res.data.comment],
          },
        }));

        setCommentText("");

        socket.emit("newComment", {
          postId: selectedPost.post._id,
          comment: res.data.comment,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("userToken"); // ✅ ADD THIS
    if (!token) return alert("Login required");

    // 🔥 instantly toggle UI
    const newSavedState = !saved;
    setSaved(newSavedState);

    try {
      setLoading(true);
      const res = await API.post(
        "/user/save-post",
        {
          postId: selectedPost.post._id,
          username: selectedPost.postOwner?.username,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.data.success) {
        // rollback if something failed
        setSaved(!newSavedState);
      }
    } catch (err) {
      console.error(err);
      // rollback on error
      setSaved(!newSavedState);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-[85vh] sm:h-[80vh] w-full bg-[#0f0f0f] rounded-none sm:rounded-xl p-2 sm:p-4 text-white">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        <button onClick={onBack}>←</button>
        <h2>{district}</h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 flex flex-col px-1 sm:px-2">
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser?.name;

          return (
            <div
              key={i}
              className={`relative group flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              {isMe && (
                <div className="absolute -right-6 top-5">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === msg._id ? null : msg._id)
                    }
                    className="text-gray-400 relative right-6 hover:text-white font-bold px-2 opacity-0 group-hover:opacity-100 "
                  >
                    ⋮
                  </button>
                </div>
              )}
              {isMe && openMenuId === msg._id && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-6 w-40 bg-[#1f1f1f] rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content || "");
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 "
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => {
                      console.log("Forward clicked");
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Forward
                  </button>

                  {msg.sender === currentUser?.name && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                    >
                      Unsend
                    </button>
                  )}
                </div>
              )}
              <span className="text-xs text-gray-400 mb-1">
                {isMe ? "You" : msg.sender}
              </span>

              {msg.type === "post" && (
                <div
                  onClick={() => setSelectedPost(msg)}
                  className="bg-white text-black rounded-lg p-2 max-w-lg cursor-pointer hover:opacity-90 transition"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={msg.postOwner?.avatar}
                      className="w-6 h-6 rounded-full"
                      alt=""
                    />
                    <span className="text-xs font-semibold">
                      {msg.postOwner?.username}
                    </span>
                  </div>

                  <img
                    src={msg.post.image}
                    className="rounded-lg max-w-[70vw] sm:max-w-xs"
                    alt="shared post"
                  />

                  {msg.post.caption && (
                    <p className="text-xs mt-1">{msg.post.caption}</p>
                  )}
                </div>
              )}

              {msg.type === "text" && (
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    isMe ? "bg-[#879F00] text-white" : "bg-white text-black"
                  }`}
                >
                  {msg.content}
                </div>
              )}
              {msg.type === "image" && (
                <div className="relative">
                  <img
                    src={msg.content}
                    onClick={() =>
                      setOpenImageMenuId(
                        openImageMenuId === msg._id ? null : msg._id,
                      )
                    }
                    className="max-w-[70vw] sm:max-w-xs md:max-w-sm rounded-lg cursor-pointer"
                    alt="chat"
                  />

                  {openImageMenuId === msg._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#1f1f1f] rounded-xl shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          downloadImage(msg.content);
                          setOpenImageMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        Download
                      </button>

                      {/* 🔥 NEW UNSEND BUTTON */}
                      {msg.sender === currentUser?.name && (
                        <button
                          onClick={() => {
                            deleteMessage(msg._id); // delete from DB + UI
                            setOpenImageMenuId(null); // close menu
                          }}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                        >
                          Unsend
                        </button>
                      )}

                      <button
                        onClick={() => setOpenImageMenuId(null)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.content} type="audio/webm" />
                </audio>
              )}

              {msg.type === "document" && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg max-w-xs ${
                    isMe ? "bg-[#879F00] text-white" : "bg-gray-800 text-white"
                  }`}
                >
                  <div className="text-3xl">📄</div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold truncate">
                      {msg.name}
                    </span>

                    <button
                      onClick={() => downloadDocument(msg.content, msg.name)}
                      className="text-xs underline opacity-80"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              <span className="text-gray-400 text-xs mt-1">
                {new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative flex items-center gap-2 sm:gap-3 border-t border-gray-700 pt-2 sm:pt-3">
        {!recording ? (
          <>
            <button onClick={() => setShowEmojis(!showEmojis)}>😊</button>

            <button onClick={() => fileInputRef.current.click()}>🖼️</button>
            <input ref={fileInputRef} type="file" hidden onChange={sendImage} />

            <button onClick={() => docInputRef.current.click()}>📎</button>
            <input
              ref={docInputRef}
              type="file"
              hidden
              onChange={sendDocument}
            />

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${district}`}
              className="flex-1 px-3 sm:px-4 py-2 rounded-full bg-gray-800 text-sm sm:text-base"
            />

            {message ? (
              <button onClick={sendMessage} className="text-[#879F00]">
                Send
              </button>
            ) : (
              <button onClick={startRecording}>🎤</button>
            )}
          </>
        ) : (
          <div className="flex justify-between w-full bg-gray-800 px-4 py-2 rounded-full">
            <button onClick={cancelRecording}>✖</button>
            <span>🔴 Recording...</span>
            <button onClick={sendRecording}>➤</button>
          </div>
        )}
      </div>
      {showEmojis && (
        <div
          ref={emojiRef}
          className="absolute bottom-14 left-2 sm:left-auto mb-10 bg-gray-800 p-3 rounded-lg w-[90%] sm:max-w-xs shadow-lg z-50"
        >
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => sendEmoji(emoji)}
                className="text-xl hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] rounded-xl p-6 w-72 text-center space-y-4">
            <h3 className="text-lg font-semibold">Message Options</h3>

            {selectedMessage?.sender === currentUser?.name && (
              <button
                onClick={deleteMessage}
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
              >
                Unsend
              </button>
            )}

            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f0f0f] text-white overflow-y-auto scrollbar-hide rounded-xl w-[95%] sm:w-[90%] md:w-[500px] max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div
                onClick={() => {
                  if (
                    selectedPost.postOwner?._id?.toString() ===
                    currentUser?._id?.toString()
                  ) {
                    setActive("PROFILE");
                  } else {
                    setActive("UPROFILE");
                    setSelectedUsername(selectedPost.postOwner.username);
                  }
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={selectedPost.postOwner?.avatar}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />

                <span className="font-semibold">
                  {selectedPost.postOwner?.username}
                </span>
              </div>

              <button onClick={() => setSelectedPost(null)} className="text-xl">
                ✖
              </button>
            </div>

            {/* Image */}
            <img
              src={selectedPost.post.image}
              className="w-full max-h-[90vh] object-cover"
              alt="post"
            />

            {/* Action Row */}
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-5">
                {/* ❤️ Like */}

                <img
                  src={liked ? heartRed : heart}
                  alt="like"
                  className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                  onClick={handleLike}
                />

                {/* 💬 Comment */}
                <img
                  src={commentIcon}
                  alt="comment"
                  className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                  onClick={() => setShowComments((prev) => !prev)}
                />
              </div>
              <svg
                onClick={handleSave}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-110"
                fill={saved ? "white" : "none"}
                stroke="white"
                strokeWidth="2"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
              </svg>
            </div>

            {/* Like Count */}
            <div className="px-4 pt-2 text-sm font-semibold">
              {like || 0} likes
            </div>
            <div className="px-4 pt-2 text-xs text-gray-400">
              {selectedPost.post.comments.length || 0} comments
            </div>

            {/* Caption */}
            <div className="px-4 pt-1 text-sm">
              <span className="font-semibold ">
                {selectedPost.postOwner?.username}
              </span>{" "}
              {selectedPost.post.caption}
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="px-4 pt-3 max-h-40 overflow-scroll scrollbar-hide space-y-2">
                {selectedPost.post.comments?.length > 0 ? (
                  selectedPost.post.comments.map((comment) => (
                    <div key={comment._id} className="text-sm">
                      <span className="font-semibold">
                        {comment.user?.toString() ===
                        currentUser?._id?.toString()
                          ? "You"
                          : comment.username || "User"}
                      </span>{" "}
                      {comment.text}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No comments yet</p>
                )}

                {/* Input */}
                <div className="flex items-center border-t border-gray-700 mt-3 pt-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={handleComment}
                    className="text-[#879F00] text-sm font-semibold"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Add Comment */}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center  z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
