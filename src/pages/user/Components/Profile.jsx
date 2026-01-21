import React, { useState } from "react";
import post1 from "../../../assets/images/Kovalam.jpeg";
import post2 from "../../../assets/images/12275dda944eb67cdde9ba2d76478ef4.jpg";
import post3 from "../../../assets/images/download (11).jpeg";
import img2 from "../../../assets/images/download.jpeg";
import settings from "../../../assets/images/icons8-settings-50.png";
import post from "../../../assets/images/icons8-menu-50.png";
import saved from "../../../assets/images/icons8-bookmark-64.png";
import profile from "../../../assets/images/icons8-test-account-32.png";

function Profile() {
      const [activeTab, setActiveTab] = useState("posts");
    
      const posts = []; // empty → shows "Photos of you"
      const savedPosts = [post2, post3, post1];
  return (
   <>
     <div className="flex h-screen w-full bg-black text-white play-regular">
         
   
         <div className="flex-1 overflow-y-auto px-10 py-8">
           {/* SETTINGS ICON */}
           <div className="flex justify-end mb-6">
             <button className="text-xl hover:text-gray-400">
               <img className="h-6" src={settings}alt="" />
             </button>
           </div>
   
           {/* PROFILE CENTER */}
           <div className="flex flex-col items-center text-center">
             {/* PROFILE IMAGE */}
             <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden mb-3">
               <img
                 src={img2}
                 alt="profile"
                 className="w-full h-full object-cover"
               />
             </div>
   
             {/* NAME */}
             <h1 className="text-xl font-semibold">john_jony__</h1>
             <p className="text-sm text-gray-400 mb-4">john</p>
   
             {/* STATS */}
             <div className="flex gap-10 mb-5">
               <div>
                 <p className="font-semibold">0</p>
                 <p className="text-xs text-gray-400">posts</p>
               </div>
               <div>
                 <p className="font-semibold">10</p>
                 <p className="text-xs text-gray-400">connected</p>
               </div>
               <div>
                 <p className="font-semibold">10</p>
                 <p className="text-xs text-gray-400">connecting</p>
               </div>
             </div>
   
             {/* EDIT PROFILE (CENTERED LIKE IMAGE) */}
             <button className="bg-[#879F00] hover:bg-[#879F00] px-6 py-2 rounded-md text-sm font-semibold w-[280px] mb-6">
               Edit profile
             </button>
           </div>
   
           {/* TABS */}
           <div className="flex justify-center border-t border-gray-700 pt-4 mb-6 gap-40">
             <button
               onClick={() => setActiveTab("posts")}
               className={`px-10 py-2 ${
                 activeTab === "posts"
                   ? "text-white border-b-2 border-white"
                   : "text-gray-400"
               }`}
             >
               <img className="h-6 w-5" src={post} alt="" />
             </button>
             <button
               onClick={() => setActiveTab("saved")}
               className={`px-10 py-2 ${
                 activeTab === "saved"
                   ? "text-white border-b-2 border-white"
                   : "text-gray-400"
               }`}
             >
               <img className="h-6 w-7" src={saved} alt="" />
             </button>
           </div>
   
           {/* CONTENT */}
           {activeTab === "posts" && posts.length === 0 ? (
             <div className="flex flex-col items-center text-gray-500 mt-17">
               <div className="text-5xl mb-3">
                 <img className="h-20 w-20" src={profile} alt="" />
               </div>
               <p className="text-4xl">Photos of you</p>
             </div>
           ) : (
             <div className="grid grid-cols-2 gap-1 max-w-[570px] mx-auto">
               {(activeTab === "posts" ? posts : savedPosts).map((img, index) => (
                 <img
                   key={index}
                   src={img}
                   alt="post"
                   className="w-full h-32 object-cover cursor-pointer"
                 />
               ))}
             </div>
           )}
         </div>
       </div>
   </>
  )
}

export default Profile