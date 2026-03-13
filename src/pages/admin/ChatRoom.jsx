import { useState } from "react";
import { MessageCircle, X, Trash2 } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import API from "../../API/Api";

const districts = [
  "THIRUVANANTHAPURAM",
  "KOLLAM",
  "PATHANAMTHITTA",
  "ALAPPUZHA",
  "KOTTAYAM",
  "IDUKKI",
  "ERNAKULAM",
  "THRISSUR",
  "PALAKKAD",
  "MALAPPURAM",
  "KOZHIKODE",
  "WAYANAD",
  "KANNUR",
  "KASARAGOD",
];

export default function ChatRoom() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [enterChat, setEnterChat] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selectedDistrict || !enterChat) return;

    fetchMessages();
  }, [selectedDistrict, enterChat]);

  const fetchMessages = async () => {
    if (!selectedDistrict) return;

    try {
      const res = await API.get(
        `/messages/${selectedDistrict}`,
      );

      const formatted = res.data.messages
        .filter((msg) => !msg.post) // ❌ remove shared posts
        .map((msg) => ({
          id: msg._id,
          user: msg.sender,
          text: msg.message?.content,
          type: msg.message?.type,
          fileUrl: msg.message?.content,
          fileName: msg.message?.name,
          time: msg.createdAt,
        }));

      setMessages(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/admin/delete-message/${id}`);

      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  /* ================= CHAT ================= */

  if (enterChat) {
    return (
      <div className="h-screen flex overflow-scroll scrollbar-hide flex-col bg-neutral-900 text-white">
        {/* Header */}

        <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedDistrict} Chat</h2>

          <button
            onClick={() => setEnterChat(false)}
            className="text-gray-400 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        {/* Messages */}

        <div className="flex-1 overflow-scroll scrollbar-hide p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-neutral-800 p-4 rounded-xl relative"
            >
              {/* User + Time */}

              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#879F00] font-semibold">{msg.user}</span>

                <span className="text-gray-400 text-xs">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message */}

              <p className="text-gray-200 text-sm">{msg.text}</p>

              {/* Image */}

              {msg.fileUrl && msg.type?.startsWith("image") && (
                <img src={msg.fileUrl} className="mt-2 rounded-lg max-h-60" />
              )}

              {/* Document */}

              {msg.fileUrl && !msg.type?.startsWith("image") && (
                <a
                  href={msg.fileUrl}
                  download
                  className="text-blue-400 underline block mt-2"
                >
                  {msg.fileName}
                </a>
              )}

              {/* Delete */}

              <button
                onClick={() => deleteMessage(msg.id)}
                className="absolute bottom-2 right-3 text-red-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= DISTRICT LIST ================= */

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl play-bold text-white text-center mb-10">
          Chat Rooms
        </h1>

        <div className="grid grid-cols-1 play-bold sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district, index) => (
            <div
              key={index}
              onClick={() => setSelectedDistrict(district)}
              className="bg-black rounded-2xl p-5 cursor-pointer hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-[#879F00]">
                  <MessageCircle size={22} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white break-words leading-tight">
                    {district}
                  </h2>

                  <p className="text-sm text-gray-500">View chat messages</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}

      {selectedDistrict && (
        <div className="fixed inset-0 play-bold bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative">
            {/* Back Button */}
            <button
              onClick={() => setSelectedDistrict(null)}
              className="absolute top-3 left-3 text-gray-500 hover:text-black flex items-center gap-1"
            >
              <ArrowLeft size={18} />
            </button>

            <h2 className="text-2xl text-black font-bold mb-2 text-center">
              {selectedDistrict}
            </h2>

            <p className="text-gray-600 mb-6 text-center">
              View all messages from {selectedDistrict} district
            </p>

            <button
              onClick={() => {
                setEnterChat(true);
                fetchMessages();
              }}
              className="w-full bg-[#879F00] text-white py-2 rounded-xl"
            >
              Open Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
