import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../../../API/Api";

function Comments({goBack}) {
  const [selected, setSelected] = useState("followers");
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("userToken");
          setLoading(true);

        const res = await API.post(
          "/user/userdetails",{},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // ✅ Normalize value
        const permission =
          res.data.user.commentsPermission?.toLowerCase() || "followers";

        setSelected(permission);
      } catch (err) {
        console.log("Fetch error:", err);
      }finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, []);

  const savePermission = async (value) => {
    const token = localStorage.getItem("userToken");
  setLoading(true);
    await API.post(
      "/user/updateCommentPermission",
      { permission: value.toLowerCase() },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
        setLoading(false);
    
  };

  return (
  <div className="w-full max-w-xl mx-auto px-4 text-white play-regular">
       {/* Back Button (Mobile Only) */}
  <button
    onClick={goBack}
    className="md:hidden mb-4 flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
  >
    ← Back
  </button>
      {/* Header */}
    <div className="mb-8">
  <h1 className="text-xl font-bold">Comments</h1>
</div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm mb-10">Allow comments from</p>

      {/* Options */}
   <div className="space-y-8 max-w-md">
        {/* Option 1 */}
        <label className="flex items-start gap-6 ">
          <input
            type="radio"
            name="comments"
            checked={selected === "followers"}
            onChange={() => {
              setSelected("followers");
              savePermission("followers");
            }}
            className="w-5 h-5 accent-white mt-1 cursor-pointer"
          />

          <div>
        <p className="text-sm font-medium">Connections you follow back</p>
<p className="text-xs text-gray-500">
  People who follow you and you follow them back.
</p>
          </div>
        </label>

        {/* Option 2 */}
        <label className="flex items-start gap-6 ">
          <input
            type="radio"
            name="comments"
            checked={selected === "followback"}
            onChange={() => {
              setSelected("followback");
              savePermission("followback");
            }}
            className="w-5 h-5 accent-white mt-1 cursor-pointer"
          />

          <div>
            <p className="text-sm font-medium">connections you follow back</p>
            <p className="text-xs text-gray-500">
              People who connect you and you connect back.
            </p>
          </div>
        </label>

        {/* Option 3 */}
        <label className="flex items-start gap-6 ">
          <input
            type="radio"
            name="comments"
            checked={
              selected === "off" && (
                <p className="text-red-400 text-sm mt-4 cursor-pointer">
                  Comments are disabled.
                </p>
              )
            }
            onChange={() => {
              setSelected("off");
              savePermission("off");
            }}
            className="w-5 h-5 accent-white mt-1 cursor-pointer"
          />

          <div>
            <p className="text-sm font-medium">Off</p>
          </div>
        </label>
      </div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default Comments;
