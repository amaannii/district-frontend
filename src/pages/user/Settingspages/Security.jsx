function Security() {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Password and security
      </h1>

      <div className="bg-gray-900 p-6 rounded-xl w-[500px]">
        <label className="block text-gray-400 mb-2">
          Change password
        </label>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 rounded bg-black border border-gray-700 mb-4"
        />

        <button className="bg-[#879F00] px-5 py-2 rounded-lg text-black font-semibold">
          Submit
        </button>
      </div>
    </div>
  );
}



export default Security;
