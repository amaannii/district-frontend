import React, { useState } from "react";

function Notifications() {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState("for 2 days");

  // ✅ dropdown open/close state
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full text-white  play-regular">
      {/* Title */}
      <h1 className="text-xl font-bold  mb-17">Notifications</h1>

      {/* Notification Card */}
      <div className="bg-white  text-black rounded-xl p-5 flex items-center justify-between w-[500px] shadow-lg">
        <p className="text-sm font-medium">notification on</p>

        {/* Toggle Switch */}
        <button
          onClick={() => {
            setEnabled(!enabled);
            setOpen(false); // close dropdown when toggle off
          }}
          className={`w-12 h-6 flex items-center rounded-full px-1 transition ${
            enabled ? "bg-[#879F00]" : "bg-gray-300"
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
              enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Duration Button */}
      {enabled && (
        <div className="mt-5 w-[350px]">
          {/* Selected Duration Display */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-5 py-3 border border-gray-700 rounded-xl text-sm bg-black hover:bg-white/5 transition"
          >
            {duration}
            <span>{open ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown Options */}
          {open && (
            <div className="mt-2 border border-gray-700 rounded-xl overflow-hidden">
              {["for 2 days", "for a week", "until turn off"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDuration(item);

                    // ✅ Close dropdown after selection
                    setOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-5 py-3 text-sm transition
                    ${
                      duration === item
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5 text-gray-300"
                    }
                  `}
                >
                  {item}

                  {/* Circle Indicator */}
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      duration === item
                        ? "border-white"
                        : "border-gray-500"
                    }`}
                  >
                    {duration === item && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
