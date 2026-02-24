import { useEffect, useRef, useState } from "react";
import socket from "../../../Socket";
import axios from "axios";

const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","🙏","🔥","🎉","❤️",
];

function ChatBox({ district, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  /* ================= FETCH USER + SOCKET ================= */

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCurrentUser(res.data.user);
      } catch (error) {
        console.log("Error fetching user ❌", error);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    if (!district) return;

    setMessages([]);

    fetch(`http://localhost:3001/messages/${district}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((msg) => ({
          ...msg.message,
          sender: msg.sender,
          time: msg.createdAt,
        }));
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

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND TEXT ================= */

  const sendMessage = () => {
    if (!message.trim() || !currentUser) return;

    socket.emit("sendMessage", {
      district,
      message: { type: "text", content: message },
      sender: currentUser.name,
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
      message: { type: "image", content: url },
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
      message: { type: "document", content: url, name: file.name },
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
        message: { type: "audio", content: url },
        sender: currentUser.name,
      });

      setRecording(false);
    };
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-full w-full bg-[#0f0f0f] text-white sm:rounded-xl sm:p-4 p-2">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3 border-b border-gray-700 pb-3">
        <button onClick={onBack} className="sm:hidden text-xl">
          ←
        </button>
        <h2 className="text-lg sm:text-xl font-semibold">{district}</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 flex flex-col pr-1">

        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser?.name;

          return (
            <div
              key={i}
              className={`flex flex-col ${
                isMe ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-400 mb-1">
                {isMe ? "You" : msg.sender}
              </span>

              {msg.type === "text" && (
                <div
                  className={`px-4 py-2 rounded-2xl break-words
                  max-w-[75%] sm:max-w-md md:max-w-lg
                  ${isMe ? "bg-[#879F00] text-white" : "bg-white text-black"}
                  `}
                >
                  {msg.content}
                </div>
              )}

              {msg.type === "image" && (
                <img
                  src={msg.content}
                  className="max-w-[75%] sm:max-w-sm md:max-w-md rounded-xl"
                  alt=""
                />
              )}

              {msg.type === "audio" && (
                <audio controls className="max-w-[75%]">
                  <source src={msg.content} />
                </audio>
              )}

              {msg.type === "document" && (
                <div className="bg-gray-800 px-4 py-2 rounded-lg max-w-[75%]">
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

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="border-t border-gray-700 pt-3">

        {!recording ? (
          <div className="flex items-center gap-2 sm:gap-3 relative">

            <button onClick={() => setShowEmojis(!showEmojis)}>😊</button>

            {showEmojis && (
              <div className="absolute bottom-14 left-0 bg-gray-900 p-3 rounded-xl flex flex-wrap gap-2 w-60">
                {EMOJIS.map((emoji, index) => (
                  <button key={index} onClick={() => sendEmoji(emoji)}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => fileInputRef.current.click()}>🖼️</button>
            <input ref={fileInputRef} type="file" hidden onChange={sendImage} />

            <button onClick={() => docInputRef.current.click()}>📎</button>
            <input ref={docInputRef} type="file" hidden onChange={sendDocument} />

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${district}`}
              className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-sm sm:text-base"
            />

            {message ? (
              <button
                onClick={sendMessage}
                className="text-[#879F00] text-sm sm:text-base"
              >
                Send
              </button>
            ) : (
              <button onClick={startRecording}>🎤</button>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center w-full bg-gray-800 px-4 py-2 rounded-full">
            <button onClick={cancelRecording}>✖</button>
            <span className="text-sm">🔴 Recording...</span>
            <button onClick={sendRecording}>➤</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatBox;