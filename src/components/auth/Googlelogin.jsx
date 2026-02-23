import { signInWithPopup } from "firebase/auth";
import { auth, googleprovider } from "../../confiq/firebase.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CompleteProfile from "../CompleteProfile.jsx";

function Googlelogin() {
  const navigate = useNavigate();
  const [profile, setprofile] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleprovider);
      const user = result.user;

      const res = await axios.post(
        "http://localhost:3001/user/google-login",
        {
          name: user.displayName,
          email: user.email,
        }
      );

      if (res.data.success === true) {
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("role", "User");
        navigate("/home");
      } else {
        setprofile(true);
      }

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed");
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        className="
          w-full 
          mt-4 
          flex 
          items-center 
          justify-center 
          gap-3 
          rounded-lg 
          border 
          border-gray-300 
          py-3 
          text-sm sm:text-base
          hover:bg-gray-50 
          transition
        "
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        <span>Log in with Google</span>
      </button>

      {profile && <CompleteProfile />}
    </>
  );
}

export default Googlelogin;