import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Explore from "./Components/Explore";
import Messages from "./Components/Messages";
import Notification from "./Components/Notification";
import Create from "./Components/Create";
import Profile from "./Components/Profile";
import More from "./Components/More";





function UserDashboard() {
   const [activePage, setActivePage] = useState("HOME");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const renderContent = () => {
    switch (activePage) {
      case "HOME":
        return   <Home
            openChat={(district) => {
              setSelectedDistrict(district);
              setActivePage("MESSAGES");
            }}
          />
      case "SEARCH":
        return <Search />;
      case "EXPLORE":
        return <Explore />;
      case "MESSAGES":
        return   <Messages
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />
      case "NOTIFICATION":
        return <Notification />;
      case "CREATE":
        return <Create />;
      case "PROFILE":
        return <Profile />;
      case "MORE":
        return <More />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex bg-black h-screen text-white play-regular">
      {/* Pass state + setter to Sidebar */}
      <Sidebar active={activePage} setActive={setActivePage} />

      {/* Content Area */}
      <div className="flex-1 flex  items-center overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
