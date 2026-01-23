
import ksg from "../../../assets/images/Bekal Fort Kasargod.jpeg";
import knr from "../../../assets/images/Theyyam.jpeg";
import ernklm from "../../../assets/images/fortkochi (1).jpeg";
import kzhd from "../../../assets/images/d60598646d40cbd774e5e4515aa3647f.jpg";
import idki from "../../../assets/images/4be085118ff742324c836f3726a690ca.jpg";
import ktym from "../../../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import wyd from "../../../assets/images/download (11).jpeg";
import mlpm from "../../../assets/images/kerala backwaters.jpeg";
import plkd from "../../../assets/images/Palakkad,Kerala (1).jpeg";
import tsr from "../../../assets/images/puthanpalli Thrissur.jpeg";
import alpzha from "../../../assets/images/Alappuzha.jpeg";
import kollm from "../../../assets/images/Kovalam.jpeg";
import pathmtta from "../../../assets/images/Pathanamthitta.jpeg";
import tvpm from "../../../assets/images/download (12).jpeg";
const miniMessages = [
  { src: ksg, title: "KASARGOD" },
  { src: knr, title: "KANNUR" },
  { src: kzhd, title: "KOZHIKODE" },
  { src: ernklm, title: "ERNAKULAM" },
  { src: idki, title: "IDUKKI" },
  { src: ktym, title: "KOTTAYAM" },
  { src: wyd, title: "WAYANAD" },
  { src: mlpm, title: "MALAPURAM" },
  { src: plkd, title: "PALAKKAD" },
  { src: tsr, title: "TRISSUR" },
  { src: alpzha, title: "ALAPPUZHA" },
  { src: kollm, title: "KOLLAM" },
  { src: pathmtta, title: "PATHANAMTHITTA" },
  { src: tvpm, title: "THIRUVANANTHAPURAM" },
];

function MiniChatBox({ openChat }) {
  return (
    <div className="h-[100vh] bg-[#0f0f0f] border-l overflow-scroll border-neutral-800 px-4 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Messages</h2>
       
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {miniMessages.map((item, i) => (
          <div
            key={i}
             onClick={() => openChat(item)}
            className="flex items-center gap-4 cursor-pointer hover:bg-neutral-900 p-2 rounded-lg transition"
          >
            <img
              src={item.src}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">
                Tap to open chat
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiniChatBox;
