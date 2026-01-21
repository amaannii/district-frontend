import { useState } from "react";

function ChatBox({ district, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] bg-[#0f0f0f] rounded-xl p-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        <button
          onClick={onBack}
          className="text-white text-lg hover:opacity-70"
        >
          ←
        </button>

        <h2 className="text-lg font-semibold">{district}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="self-end bg-white px-4 py-2 text-black rounded-lg max-w-xs"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-3 border-t border-gray-700 pt-3">
        <button>😊</button>
        <button>📎</button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${district}`}
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 outline-none"
        />

        <button
          onClick={sendMessage}
          className="text-[#879F00] font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
