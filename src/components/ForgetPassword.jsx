import logo from "../assets/images/logo.jpg"


const ForgetPassword = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <img className="w-[172px] h-[129px]" src={logo} alt="" />
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-5 py-2 rounded-lg w-[50px]">
            login
          </button>
          <a href="#" className="text-lime-500 font-medium">
            Sign up
          </a>
        </div>
      </header>

      {/* Card */}
      <div className="flex justify-center mt-16">
        <div className="w-[420px] bg-black text-white rounded-xl overflow-hidden">
          <div className="px-8 py-10 text-center">
            {/* Icon */}
            <div className="text-4xl mb-5">🔒</div>

            <p className="text-sm text-gray-300 mb-5">
              Enter your email, phone, or username and we'll send you a link
              to get back into your account.
            </p>

            <input
              type="text"
              placeholder="Email, Phone, or Username"
              className="w-full px-4 py-3 rounded-lg text-black mb-4 outline-none"
            />

            <button className="w-full bg-lime-900 hover:bg-lime-800 transition py-3 rounded-lg mb-6">
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
