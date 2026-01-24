import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Get email from Google login
  useEffect(() => {
    const storedEmail = localStorage.getItem("googleEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");

      const res = await axios.post(
        "http://localhost:3001/user/complete-profile",
        {
          email,
          username,
          password,
        }
      );

      if (res.data.success==true) {
       
        navigate("/home");
      } else {
        setError(res.data.message || "Failed to complete profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex absolute top-0 items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Create a username and password to continue
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full mt-1 px-4 py-3 rounded-lg border bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              placeholder="choose_username123"
              className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "")
                )
              }
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM */}
          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
