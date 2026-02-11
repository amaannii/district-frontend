import { useRef, useState, useEffect } from "react";

const EMOJIS = ["😀","😂","😍","🥰","😎","🤔","😢","😡","👍","🙏","🔥","🎉","❤️"];

function ChatBox({ district, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [previewIndex, setPreviewIndex] = useState(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`chat_${district}`);
    if (stored) setMessages(JSON.parse(stored));
  }, [district]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`chat_${district}`, JSON.stringify(messages));
  }, [messages, district]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { 
      type: "text", 
      content: message, 
      time: new Date().toISOString() 
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage("");
  };

  const sendEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const sendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMsg = { type: "image", content: url, time: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
  };

  const sendDocument = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMsg = { type: "document", content: url, name: file.name, time: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
  };

  // 🎤 Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mediaRecorderRef.current.start();
    setRecording(true);
    setSeconds(0);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    setSeconds(0);
    audioChunksRef.current = [];
  };

  const sendRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const newMsg = { type: "audio", content: audioUrl, time: new Date().toISOString() };
      setMessages(prev => [...prev, newMsg]);
      setRecording(false);
      setSeconds(0);
    };
  };

  return (
    <div className="flex flex-col h-[80vh] bg-[#0f0f0f] rounded-xl p-4 relative">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        <button onClick={onBack} className="text-white text-lg">←</button>
        <h2 className="text-lg font-semibold">{district}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 flex flex-col">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col items-end">
            {msg.type === "text" && (
              <div className="self-end bg-white px-4 py-2 text-black rounded-lg max-w-xs">
                {msg.content}
              </div>
            )}

            {msg.type === "image" && (
              <img
                src={msg.content}
                className="self-end max-w-xs rounded-lg cursor-pointer"
                alt="sent"
                onClick={() => setPreviewIndex(i)}
              />
            )}

            {msg.type === "audio" && (
              <audio controls className="self-end max-w-xs">
                <source src={msg.content} />
              </audio>
            )}

            {msg.type === "document" && (
              <div
                className="self-end bg-gray-800 px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setPreviewIndex(i)}
              >
                📄 {msg.name}
              </div>
            )}

            {/* Timestamp */}
            <span className="text-gray-400 text-xs mt-1">
              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="flex flex-wrap gap-2 mb-2">
          {EMOJIS.map((e, i) => (
            <button key={i} onClick={() => sendEmoji(e)}>
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-3 border-t border-gray-700 pt-3">
        {!recording ? (
          <>
            <button onClick={() => setShowEmojis(!showEmojis)}>😊</button>

            <button onClick={() => fileInputRef.current.click()}>🖼️</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={sendImage}
            />

            <button onClick={() => docInputRef.current.click()}>📎</button>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              hidden
              onChange={sendDocument}
            />

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${district}`}
              className="flex-1 px-4 py-2 rounded-full bg-gray-800 outline-none"
            />

            {message ? (
              <button onClick={sendMessage} className="text-[#879F00] font-medium">
                Send
              </button>
            ) : (
              <button onClick={startRecording}>🎤</button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between w-full bg-gray-800 px-4 py-2 rounded-full">
            <button onClick={cancelRecording} className="text-red-500">✖</button>
            <div className="flex items-center gap-2 text-red-500">🔴 {formatTime(seconds)}</div>
            <button onClick={sendRecording} className="text-[#879F00]">➤</button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ✖
            </button>

            {messages[previewIndex].type === "image" && (
              <img
                src={messages[previewIndex].content}
                className="max-h-[80vh] max-w-[80vw] rounded-lg"
              />
            )}

            {messages[previewIndex].type === "document" && (
              <div className="flex flex-col items-center gap-4 text-white">
                <p>📄 {messages[previewIndex].name}</p>
                <a
                  href={messages[previewIndex].content}
                  download={messages[previewIndex].name}
                  className="px-4 py-2 bg-[#879F00] rounded"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ChatBox;
