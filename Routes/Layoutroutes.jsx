import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/components/Home"
import Signup from "../src/components/Signup"
import ForgetPassword from "../src/components/ForgetPassword"
import Login from "../src/components/login"
import Explore from "../src/components/Explore"
import Sidebar from "../src/components/Sidebar"
import Search from "../src/components/Search"
import Notificationlist from "../src/components/Notificationlist"
import CompleteProfile from "../src/components/CompleteProfile"
import AdminLogin from "../src/pages/admin/Adminlogin"
import Admindashboard from "../src/pages/admin/Admindashboard"
import Protectedroute from "./Protectedroute"

function Layoutroutes() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/Home" element={<Home/>} />
        <Route path="/Explore" element={<Explore/>} />
        <Route path="/side" element={<Sidebar/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgetten" element={<ForgetPassword/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/notification" element={<Notificationlist/>} />
        <Route path="/completeprofile" element={<CompleteProfile/>} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/admindashboard" element={
          <Protectedroute>

            <Admindashboard/>
          </Protectedroute>
          } />
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default Layoutroutes