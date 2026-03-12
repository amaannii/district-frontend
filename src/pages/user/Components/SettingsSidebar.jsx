function SettingsSidebar({ activeSetting, setActiveSetting }) {

  const menuItems = [
    { name: "Edit Profile", key: "EditProfile" },
    { name: "Notifications", key: "Notifications" },
    { name: "Password & Security", key: "Security" },
    { name: "Your Information and Permission", key: "Informations" },
    { name: "Comments", key: "Comments" },
  ];

  return (
    <aside className="h-screen bg-black text-white border-r border-gray-800 flex flex-col py-6 md:py-9 w-full md:w-[260px]">

      {/* Title */}
      <div className="mb-6 md:mb-10 px-6">
        <h2 className="text-lg md:text-xl font-semibold tracking-wide">
          Settings
        </h2>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 px-2">

        {menuItems.map((item) => {
          const isActive = activeSetting === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveSetting(item.key)}
              className={`relative flex items-center py-3 rounded-lg text-sm transition
                ${isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[4px] bg-[#879F00] rounded-full"></span>
              )}

              <span className="ml-3">{item.name}</span>
            </button>
          );
        })}

      </div>

    </aside>
  );
}

export default SettingsSidebar;