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
  { src: mlpm, title: "MALAPPURAM" },
  { src: plkd, title: "PALAKKAD" },
  { src: tsr, title: "THRISSUR" },
  { src: alpzha, title: "ALAPPUZHA" },
  { src: kollm, title: "KOLLAM" },
  { src: pathmtta, title: "PATHANAMTHITTA" },
  { src: tvpm, title: "THIRUVANANTHAPURAM" },
];

function MiniChatBox({ openChat }) {
  return (
    <div
      className="
        w-full 
        md:w-[320px] 
        lg:w-[350px]
        h-screen 
        bg-[#0f0f0f] 
        border-neutral-800 
        md:border-l
        overflow-y-auto 
        scrollbar-hide
        px-4 
        py-6
      "
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#0f0f0f] z-10 pb-4">
        <h2 className="text-lg font-semibold text-white">
          Messages
        </h2>
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {miniMessages.map((item, i) => (
          <div
            key={i}
            onClick={() => openChat(item)}
            className="
              flex items-center gap-4 
              cursor-pointer 
              hover:bg-neutral-900 
              p-3 
              rounded-xl 
              transition duration-200
            "
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-semibold text-white">
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