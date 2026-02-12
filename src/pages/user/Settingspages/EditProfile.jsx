

function EditProfile() {

  return (
    <>
    <div className="play-regular">
      <h1 className="text-3xl font-bold mb-6 ">Edit Profile</h1>

      {/* Profile Card */}
      <div className="flex items-center justify-between bg-gray-200 text-black p-4 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            className="w-14 h-14 rounded-full"
            alt=""
          />

          <div>
            <p className="font-bold">john_jony__</p>
            <p className="text-sm text-gray-600">john</p>
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Change Photo
        </button>
      </div>

      {/* Bio */}
      <label className="block mb-2 text-gray-300">Bio</label>
      <input
        placeholder="Bio"
        className="w-full bg-black border border-gray-600 p-3 rounded-lg mb-6"
      />

      {/* Gender */}
      <label className="block mb-2 text-gray-300">Gender</label>
      <select className="w-full bg-black border border-gray-600 p-3 rounded-lg mb-10">
        <option>Female</option>
        <option>Male</option>
      </select>

      <button className="bg-[#879F00] px-6 py-3 rounded-lg">
        Submit
      </button>
    </div>
    </>
  );
}

export default EditProfile;

