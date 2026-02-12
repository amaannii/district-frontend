import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";

import EditProfile from "../Settingspages/EditProfile";
import Notifications from "../Settingspages/Notifications";
import Security from "../Settingspages/Security";
import Informations from "../Settingspages/Informations";
import Comments from "../Settingspages/Comments";

function Settings() {
  const [activeSetting, setActiveSetting] = useState("EditProfile");

  const renderPage = () => {
    switch (activeSetting) {
      case "EditProfile":
        return <EditProfile />;
      case "Notifications":
        return <Notifications />;
      case "Security":
        return <Security />;
      case "Informations":
        return <Informations />;
      case "Comments":
        return <Comments />;
      default:
        return <EditProfile />;
    }
  };

  return (
    <div className="flex w-full h-full bg-black text-white play-regular">

      {/* Settings Sidebar */}
      <SettingsSidebar
        activeSetting={activeSetting}
        setActiveSetting={setActiveSetting}
      />

      {/* Right Content */}
      <div className="flex-1 px-16 py-12 overflow-y-auto">
        {renderPage()}
         
      </div>
    </div>
  );
}

export default Settings;
