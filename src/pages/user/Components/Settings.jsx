import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";

import EditProfile from "../Settingspages/EditProfile";
import Notifications from "../Settingspages/Notifications";
import Security from "../Settingspages/Security";
import Informations from "../Settingspages/Informations";
import Comments from "../Settingspages/Comments";

function Settings() {
  const [activeSetting, setActiveSetting] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelect = (key) => {
    setActiveSetting(key);

    // Hide sidebar on mobile
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };
const renderPage = () => {
  switch (activeSetting) {
    case "EditProfile":
      return (
        <EditProfile
          goBack={() => setActiveSetting(null)}
        />
      );

    case "Notifications":
      return <Notifications goBack={() => setActiveSetting(null)} />;

    case "Security":
      return <Security goBack={() => setActiveSetting(null)} />;

    case "Informations":
      return <Informations goBack={() => setActiveSetting(null)} />;

    case "Comments":
      return <Comments goBack={() => setActiveSetting(null)} />;

    default:
      return null;
  }
};

  return (
   <div className="flex w-full min-h-screen bg-black text-white">

  {/* Settings Sidebar */}
  <div className={`${activeSetting ? "hidden md:block" : "block"} w-full md:w-[260px] border-r border-gray-800`}>
    <SettingsSidebar
      activeSetting={activeSetting}
      setActiveSetting={setActiveSetting}
    />
  </div>

  {/* Page Content */}
  {activeSetting && (
    <div className="flex-1 px-6 md:px-12 lg:px-16 py-8 overflow-y-auto">
      {renderPage()}
    </div>
  )}

</div>
  );
}

export default Settings;