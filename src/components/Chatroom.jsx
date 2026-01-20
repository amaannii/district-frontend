import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const STATES = [
  "KASARGOD",
  "KANNUR",
  "WAYANAD",
  "KOZHIKODE",
  "MALAPPURAM",
  "PALAKKAD",
  "THRISSUR",
  "ERNAKULAM",
  "IDUKKI",
  "KOTTAYAM",
  "ALAPPUZHA",
  "PATHANAMTHITTA",
  "KOLLAM",
  "THIRUVANANTHAPURAM",
];

const EMOJIS = [
  "😀","😂","😍","🥰","😎","😭","😡","👍","🔥","❤️","🙏",
  "🎉","😴","🤯","🥳","😇","🤝","💯","✨","😜"
];

function Chatroom() {
  const { state } = useParams();
  const navigate = useNavigate();

  const [activeState, setActiveState] = useState(state || "KASARGOD");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [chats, setChats] = useState({});
  const [recording, setRecording] = useState(false);

  const fileRef = useRef();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sync state with URL param
  useEffect(() => {
    if (state) setActiveState(state);
  }, [state]);

  /* SEND TEXT */
  const sendText = () => {
    if (!message.trim()) return;

    setChats((prev) => ({
      ...prev,
      [activeState]: [
        ...(prev[activeState] || []),
        { type: "text", from: "me", value: message },
      ],
    }));

    setMessage("");
  };

  /* SEND IMAGE */
  const sendImage = (file) => {
    const url = URL.createObjectURL(file);

    setChats((prev) => ({
      ...prev,
      [activeState]: [
        ...(prev[activeState] || []),
        { type: "image", from: "me", value: url },
      ],
    }));
  };

  /* AUDIO RECORD */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) =>
      audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      setChats((prev) => ({
        ...prev,
        [activeState]: [
          ...(prev[activeState] || []),
          { type: "audio", from: "me", value: url },
        ],
      }));
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex h-screen bg-black text-white relative">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="absolute  text-white z-50 mr-4.5 rounded-2xl bg-gray-400 px-2 py-1"
      >
        ← 
      </button>

      {/* LEFT SIDEBAR */}
      <div className="w-[280px] border-r border-gray-800 px-4 py-3 mt-4">
        <h1 className="font-semibold mb-3">john_jony__</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search state..."
          className="w-full mb-4 px-3 py-2 rounded-full bg-gray-200 text-black text-sm outline-none"
        />

        <div className="space-y-2 overflow-y-auto h-[85%] pr-1">
          {STATES.filter((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          ).map((s) => (
            <div
              key={s}
              onClick={() => {
                setActiveState(s);
                navigate(`/Chat/${s}`);
              }}
              className={`py-2 text-xs font-semibold text-center rounded cursor-pointer transition ${
                activeState === s
                  ? "bg-white text-black"
                  : "bg-gray-300 text-black hover:bg-gray-200"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white text-black">
        {/* HEADER */}
        <div className="h-14 border-b px-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{activeState}</h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {(chats[activeState] || []).map((msg, i) => (
            <div
              key={i}
              className={msg.from === "me" ? "flex justify-end" : "flex"}
            >
              <div className="max-w-xs">
                {msg.type === "text" && (
                  <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm">
                    {msg.value}
                  </div>
                )}
                {msg.type === "image" && (
                  <img
                    src={msg.value}
                    alt=""
                    className="w-64 rounded-lg cursor-pointer"
                  />
                )}
                {msg.type === "audio" && (
                  <audio controls src={msg.value} className="w-64" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="h-14 border-t px-4 flex items-center gap-3 relative">
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

          {showEmoji && (
            <div className="absolute bottom-16 left-4 bg-white border rounded-lg p-2 grid grid-cols-5 gap-2">
              {EMOJIS.map((e) => (
                <span
                  key={e}
                  className="cursor-pointer"
                  onClick={() => setMessage((m) => m + e)}
                >
                  {e}
                </span>
              ))}
            </div>
          )}

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
            placeholder="Message..."
            className="flex-1 px-4 py-2 rounded-full border outline-none text-sm"
          />

          <button onClick={() => fileRef.current.click()}>🖼️</button>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => sendImage(e.target.files[0])}
          />

          {!recording ? (
            <button onClick={startRecording}>🎤</button>
          ) : (
            <button onClick={stopRecording} className="text-red-500">
              ⏹
            </button>
          )}

          <button
            onClick={sendText}
            className="bg-black text-white px-4 py-1 rounded-full text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
