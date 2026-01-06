import logo from "../assets/images/logo.jpg"
import lock from "../assets/images/Vector.png"


const ForgetPassword = () => {
  return (
    <div className="min-h-screen bg-white play-regular ">
      {/* Header */}
      <header className="flex items-center justify-between px-10 h-[70px]">
        <div className="flex items-center gap-2 font-bold text-lg">
          <img className="w-[172px] h-[129px]" src={logo} alt="" />
        </div>


        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-5 py-2  rounded-lg w-[50px]">
            </button>
</div>
        <div className="flex items-center gap-4 ">
          <button className="bg-black play-regular  text-white px-5 py-2 rounded-lg w-[120px] h-[30px] items-center flex justify-center">

            login
          </button>
          <a href="#" className="text-[#879F00] font-medium">
            Sign up
          </a>
        </div>
      </header>

      {/* Card */}
      <div className="flex justify-center items-center h-[600px]">
        <div className="w-[420px] bg-black text-white rounded-xl overflow-hidden">
          <div className="px-8 py-10 text-center">
            {/*lock icon*/}
            <img className="h-[110px] w-[88px] mb-5" src={lock} alt="" />
            

            <p className="text-sm text-gray-300 mb-5 play-regular ">
              Enter your email, phone, or username and we'll send you a link
              to get back into your account.
            </p>

            <input
              type="text"
              placeholder="Email, Phone, or Username"
              className="w-full play-regular  px-4 py-3 rounded-lg text-black mb-4 outline-none bg-white h-[44px]"
            />

            <button className="w-full bg-[#879F00] opacity-50 transition py-3 rounded-lg mb-6 play-regular ">
              Send login link
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            <a href="#" className="block text-sm mb-8">
              Create new account
            </a>
          </div>

          {/* Bottom */}
          <div className="bg-gray-300 text-black text-center py-3 cursor-pointer">
            Back to login
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
