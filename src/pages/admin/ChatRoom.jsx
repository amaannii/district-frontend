import { MessageCircle } from "lucide-react";

const districts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function ChatRoom() {
  return (
    <div className="min-h-screen h-[100vh] overflow-scroll p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
           Chat Rooms
        </h1>

        {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {districts.map((district, index) => (
    <div
      key={index}
      className="group relative bg-white rounded-2xl p-5 shadow-md 
                 border border-gray-200 cursor-pointer
                 hover:shadow-2xl hover:-translate-y-1 
                 transition-all duration-300"
    >
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#879F00] rounded-l-2xl"></div>

      <div className="flex items-center justify-between">
        {/* Left Content */}
        <div className="flex items-center gap-4">
          <div className="bg-[#879F00]/10 p-3 rounded-xl text-[#879F00]">
            <MessageCircle size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {district}
            </h2>
            <p className="text-sm text-gray-500">
              District chat room
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 group-hover:text-[#879F00] transition">
          →
        </div>
      </div>
    </div>
  ))}
</div>


      </div>
    </div>
  );
}
