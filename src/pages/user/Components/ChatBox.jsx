import { useRef, useState } from "react";

const EMOJIS = ["😀","😂","😍","🥰","😎","🤔","😢","😡","👍","🙏","🔥","🎉","❤️"];

function ChatBox({ district, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
const mediaRecorderRef = useRef(null);
const audioChunksRef = useRef([]);
const [recording, setRecording] = useState(false);
const [loading, setloading] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { type: "text", content: message }]);
    setMessage("");
  };

  const sendEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const sendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { type: "image", content: url }]);
  };

  const sendAudio = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { type: "audio", content: url }]);
  };
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorderRef.current = new MediaRecorder(stream);
  audioChunksRef.current = [];

  mediaRecorderRef.current.ondataavailable = (e) => {
    audioChunksRef.current.push(e.data);
  };

  mediaRecorderRef.current.onstop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    setMessages((prev) => [
      ...prev,
      { type: "audio", content: audioUrl },
    ]);
  };

  mediaRecorderRef.current.start();
  setRecording(true);
};

const stopRecording = () => {
  mediaRecorderRef.current.stop();
  setRecording(false);
};

  return (
    <div className="flex flex-col h-[80vh] bg-[#0f0f0f] rounded-xl p-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        <button onClick={onBack} className="text-white text-lg hover:opacity-70">
          ←
        </button>
        <h2 className="text-lg font-semibold">{district}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 flex flex-col">
        {messages.map((msg, i) => {
          if (msg.type === "text") {
            return (
              <div key={i} className="self-end bg-white px-4 py-2 text-black rounded-lg max-w-xs">
                {msg.content}
              </div>
            );
          }

          if (msg.type === "image") {
            return (
              <img
                key={i}
                src={msg.content}
                className="self-end max-w-xs rounded-lg"
                alt="sent"
              />
            );
          }

          if (msg.type === "audio") {
            return (
              <audio key={i} controls className="self-end">
                <source src={msg.content} />
              </audio>
            );
          }

          return null;
        })}
      </div>

      {/* Emoji Picker (no UI change, floats above input) */}
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
        <button onClick={() => setShowEmojis(!showEmojis)}>😊</button>

        <button onClick={() => fileInputRef.current.click()}>📎</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={sendImage}
        />

       <button
  onClick={recording ? stopRecording : startRecording}
>
  🎤
</button>

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={sendAudio}
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${district}`}
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 outline-none"
        />

        <button onClick={sendMessage} className="text-[#879F00] font-medium">
          Send
        </button>
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

export default ChatBox;
