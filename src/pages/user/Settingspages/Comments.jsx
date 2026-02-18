import axios from "axios";
import React, { useEffect, useState } from "react";

function Comments() {
  const [selected, setSelected] = useState("followers");

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("userToken");
        

        const res = await axios.post(
          "http://localhost:3001/user/userdetails",{},
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
      }
    };

    fetchPermission();
  }, []);

  const savePermission = async (value) => {
    const token = localStorage.getItem("userToken");

    await axios.post(
      "http://localhost:3001/user/updateCommentPermission",
      { permission: value.toLowerCase() },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  };

  return (
    <div className="w-full text-white play-regular">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Comments</h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm mb-10">Allow comments from</p>

      {/* Options */}
      <div className="space-y-10">
        {/* Option 1 */}
        <label className="flex items-start gap-6 cursor-pointer">
          <input
            type="radio"
            name="comments"
            checked={selected === "followers"}
            onChange={() => {
              setSelected("followers");
              savePermission("followers");
            }}
            className="w-5 h-5 accent-white mt-1"
          />

          <div>
            <p className="text-sm font-medium">Your connections</p>
            <p className="text-xs text-gray-500">
              Only people you are connected with can comment.
            </p>
          </div>
        </label>

        {/* Option 2 */}
        <label className="flex items-start gap-6 cursor-pointer">
          <input
            type="radio"
            name="comments"
            checked={selected === "followback"}
            onChange={() => {
              setSelected("followback");
              savePermission("followback");
            }}
            className="w-5 h-5 accent-white mt-1"
          />

          <div>
            <p className="text-sm font-medium">connections you follow back</p>
            <p className="text-xs text-gray-500">
              People who connect you and you connect back.
            </p>
          </div>
        </label>

        {/* Option 3 */}
        <label className="flex items-start gap-6 cursor-pointer">
          <input
            type="radio"
            name="comments"
            checked={
              selected === "off" && (
                <p className="text-red-400 text-sm mt-4">
                  Comments are disabled.
                </p>
              )
            }
            onChange={() => {
              setSelected("off");
              savePermission("off");
            }}
            className="w-5 h-5 accent-white mt-1"
          />

          <div>
            <p className="text-sm font-medium">Off</p>
          </div>
        </label>
      </div>
    </div>
  );
}

export default Comments;
