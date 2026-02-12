import React, { useState } from "react";

function Comments() {
  const [selected, setSelected] = useState("connections");

  return (
    <div className="play-regular text-white">

      {/* Page Title */}
      <h1 className="text-xl font-bold mb-16">
        Comments
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 mb-6">
        Choose who can comment on your posts.
      </p>

      {/* Radio Box */}
      <div className="w-[520px] border border-gray-700 rounded-2xl p-6 space-y-6">

        {/* Option 1 */}
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-white font-medium">
              Your connections
            </p>
            <p className="text-sm text-gray-500">
              Only people you are connected with can comment.
            </p>
          </div>

          <input
            type="radio"
            name="comments"
            checked={selected === "connections"}
            onChange={() => setSelected("connections")}
            className="w-5 h-5 accent-white"
          />
        </label>

        {/* Option 2 */}
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-white font-medium">
              Connections you follow back
            </p>
            <p className="text-sm text-gray-500">
              People who follow you and you follow back.
            </p>
          </div>

          <input
            type="radio"
            name="comments"
            checked={selected === "followback"}
            onChange={() => setSelected("followback")}
            className="w-5 h-5 accent-white"
          />
        </label>

        {/* Option 3 */}
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-white font-medium">
              Off
            </p>
            <p className="text-sm text-gray-500">
              No one can comment on your posts.
            </p>
          </div>

          <input
            type="radio"
            name="comments"
            checked={selected === "off"}
            onChange={() => setSelected("off")}
            className="w-5 h-5 accent-white"
          />
        </label>

      </div>
    </div>
  );
}

export default Comments;
