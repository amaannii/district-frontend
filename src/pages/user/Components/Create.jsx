import { useState } from "react";
import uploadIcon from "../../../assets/images/icons8-gallery-48.png";
import Home from "./Home";

function Create() {
     const [isOpen, setIsOpen] = useState(true);
  return (
    <>
     <div className="relative w-full h-full text-white play-regular">
      {/* Home UI */}
      <Home />

      {/* Overlay + Center Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 rounded-3xl">
          
          {/* Modal */}
          <div className="bg-[#0f0f0f] w-[420px] rounded-2xl shadow-2xl relative">
            
            {/* Header */}
            <div className="border-b border-gray-700 text-center py-3 font-semibold bg-[#879F00] rounded-t-2xl">
              Create new post
            </div>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-3 text-gray-300 hover:text-white text-xl"
            >
              ×
            </button>

            {/* Content */}
            <div className=" flex flex-col items-center">
              <div className="border-2 border-dashed border-gray-600 rounded-lg w-full h-64 flex flex-col items-center justify-center hover:border-gray-400 transition">
                <img src={uploadIcon} alt="upload" className="h-14 w-14 mb-4" />
                <p className="text-gray-400 mb-4">Drag photos here</p>
                <button className="bg-[#879F00] px-4 py-2 rounded hover:bg-[#879F00]">
                  Select from computer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default Create