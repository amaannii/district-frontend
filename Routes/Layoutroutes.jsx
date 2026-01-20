import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/components/Home";
import Signup from "../src/components/Signup";
import ForgetPassword from "../src/components/ForgetPassword";
import Login from "../src/components/login";
import Explore from "../src/components/Explore";
import Sidebar from "../src/components/Sidebar";
import Search from "../src/components/Search";
import Notificationlist from "../src/components/Notificationlist";
import CompleteProfile from "../src/components/CompleteProfile";
import AdminLogin from "../src/pages/admin/Adminlogin";
import Protectedroute from "./Protectedroute";
import Userprotectedroute from "./Userprotectedroute";
import AdminLayout from "../src/pages/admin/MainContent";
import DashboardHome from "../src/pages/admin/DashboardHome";
import MainContent from "../src/pages/admin/MainContent";
import Admindashboard from "../src/pages/admin/Admindashboard";
import UserManagement from "../src/pages/admin/UserManagement";
import Create from "../src/components/Create";
import Messages from "../src/components/Messages";

function Layoutroutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/Home"
            element={
              <Userprotectedroute>
                <Home />
              </Userprotectedroute>
            }
          />
          <Route
            path="/Explore"
            element={
              <Userprotectedroute>
                <Explore />
              </Userprotectedroute>
            }
          />
          <Route
            path="/sidebar"
            element={
              <Userprotectedroute>
                <Sidebar />
              </Userprotectedroute>
            }
          />

          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetten" element={<ForgetPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notification" element={<Notificationlist />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/create" element={<Create/>} />
          <Route path="/messages" element={<Messages/>} />

          <Route
            path="/admindashboard"
            element={
              <Protectedroute>
                <Admindashboard />
              </Protectedroute>
            }
          />
      
          <Route path="/maincontent" element={<MainContent />} />
     
          {/* <Route path="/messages" element={<MessageAlerts />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Layoutroutes;
