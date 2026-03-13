import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../API/Api";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();
      setLoading(true);
   try{
    const res =await API.post("/admin/admin-login", {
      email,
      password,
    });
    
    
    if (res.data.success === true) {
       
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "login successful",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/admindashboard");

    } else {
      Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Invalid credentials",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
    }
    } catch (error) {
    Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Invalid credentials",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
  }
        setLoading(false);

    // connect backend here
  };

  return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
      <div className="w-[99%] max-w-6xl h-[95vh] bg-black rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT LOGIN PANEL */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm text-center text-white px-6">

            <h1 className="text-2xl font-semibold mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              Enter your credentials to access your account.
            </p>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-[#2a2a2a] text-white placeholder-white outline-none focus:ring-2 focus:ring-gray-500"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-xl bg-[#2a2a2a] text-white placeholder-white outline-none focus:ring-2 focus:ring-gray-500"
            />

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#2b2b2b] text-white py-3 rounded-xl font-medium  transition"
            >
              Continue
            </button>

            <p className="text-xs  text-gray-500 mt-6">
              © 2026 Ditto. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT IMAGE PANEL */}
        <div className="hidden md:block relative bg-[#262626] ">
          <img
        src="https://i.pinimg.com/1200x/a3/ea/e1/a3eae107f7c8342eb4ac81a9111e9f16.jpg"

            alt="Ditto Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
{loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
      </div>
    </div>
  );
}



