function SettingsSidebar({ activeSetting, setActiveSetting }) {
  const menuItems = [
    { name: "Edit Profile", key: "EditProfile" },
    { name: "Notifications", key: "Notifications" },
    { name: "Password & Security", key: "Security" },
    { name: "Your Information and Permission", key: "Informations" },
    { name: "Comments", key: "Comments" },
  ];

  return (
    <aside className="h-screen bg-black text-white border-r border-gray-800 flex flex-col py-9 w-[260px]">

      {/* Title like Sidebar Logo Space */}
      <div className="mb-10 px-6">
        <h2 className="text-xl font-semibold tracking-wide uppercase">
          Settings
        </h2>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-2">
        {menuItems.map((item) => {
          const isActive = activeSetting === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveSetting(item.key)}
              className={`relative flex items-center  py-3 rounded-lg text-sm tracking-wide transition
                ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
                ${isActive ? "bg-white/10" : "hover:bg-white/5"}
              `}
            >
              {/* Active Green Line like Your Design */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[4px] bg-[#879F00] rounded-full"></span>
              )}

              {/* Text aligned exactly like HOME */}
              <span className="ml-3">{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default SettingsSidebar;
