import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Explore from "./Components/Explore";
import Messages from "./Components/Messages";
import Notification from "./Components/Notification";
import Create from "./Components/Create";
import Profile from "./Components/Profile";
import Settings from "./Components/Settings";
import More from "./Components/More";
// ✅ NEW SETTINGS PAGE

function UserDashboard() {
  const [activePage, setActivePage] = useState("HOME");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const renderContent = () => {
    switch (activePage) {
      case "HOME":
        return (
          <Home
            openChat={(district) => {
              setSelectedDistrict(district);
              setActivePage("MESSAGES");
            }}
          />
        );

      case "SEARCH":
        return <Search />;

      case "EXPLORE":
        return <Explore />;

      case "MESSAGES":
        return (
          <Messages
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />
        );

      case "NOTIFICATION":
        return <Notification />;

      case "CREATE":
        return <Create />;

      case "PROFILE":
        return <Profile setActive={setActivePage}  />;

      case "SETTINGS":
        return <Settings />;
      // ✅ SETTINGS PANEL HERE
      case "MORE":
        return <More setActive={setActivePage} />;

      default:
        return <Home />;
    }
  };

  return (
    <div className="flex bg-black h-screen text-white play-regular">
      {/* Main Sidebar */}
      <Sidebar active={activePage} setActive={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">{renderContent()}</div>
    </div>
  );
}

export default UserDashboard;
