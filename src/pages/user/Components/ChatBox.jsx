import { useEffect, useRef, useState } from "react";
import socket from "../../../Socket";
import axios from "axios";

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

function ChatBox({ district, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentUser, setcurrentUser] = useState(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const user = res.data.user;
        setcurrentUser(user);
      } catch (error) {
        console.log("Error fetching notification settings ❌", error);
      }
    };

    fetchDetails();
    if (!district) return;

    setMessages([]);

    // 🔥 Fetch old messages
fetch(`http://localhost:3001/messages/${district}`)
  .then((res) => res.json())
  .then((data) => {
    const formatted = data.messages.map((msg) => {
      // 🔥 If it is a shared post
      if (msg.post) {
        return {
          type: "post",
          post: msg.post,
          postOwner: msg.postOwner,
          sender: msg.sender,
          time: msg.createdAt,
        };
      }

      // 🔥 Normal text message
      return {
        type: msg.type,
        content: msg.message?.content,
        sender: msg.sender,
        time: msg.createdAt,
      };
    });

    setMessages(formatted);
  });
    socket.emit("joinDistrict", district);

    const receiveHandler = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg.message,
          sender: msg.sender,
          time: msg.createdAt,
        },
      ]);
    };

    socket.on("receiveMessage", receiveHandler);

    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.emit("leaveDistrict", district);
    };
  }, [district]);

  /* ================= SEND TEXT ================= */

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

  const sendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    socket.emit("sendMessage", {
      district,
      message: {
        type: "image",
        content: url,
      },
      sender: currentUser.name,
    });
  };

  /* ================= DOCUMENT ================= */

  const sendDocument = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    socket.emit("sendMessage", {
      district,
      message: {
        type: "document",
        content: url,
        name: file.name,
      },
      sender: currentUser.name,
    });
  };

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

  const sendRecording = () => {
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      socket.emit("sendMessage", {
        district,
        message: {
          type: "audio",
          content: url,
        },
        sender: currentUser.name,
      });

      setRecording(false);
    };
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col  h-[80vh] bg-[#0f0f0f] rounded-xl p-4 text-white">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        <button onClick={onBack}>←</button>
        <h2>{district}</h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 flex flex-col">
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser?.name;

          return (
            <div
              key={i}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-gray-400 mb-1">
                {isMe ? "You" : msg.sender}
              </span>

              {msg.type === "post" && (
  <div className="bg-white text-black rounded-lg p-2 max-w-lg">
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
      className="rounded-lg max-w-xs"
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
                <img src={msg.content} className="max-w-xs rounded-lg" alt="" />
              )}

              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.content} />
                </audio>
              )}

              {msg.type === "document" && (
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                  📄 {msg.name}
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
      </div>

      <div className="flex items-center gap-3 border-t border-gray-700 pt-3">
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
              className="flex-1 px-4 py-2 rounded-full bg-gray-800"
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
    </div>
  );
}

export default ChatBox;
