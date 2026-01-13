import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/components/Home"
import Signup from "../src/components/Signup"
import ForgetPassword from "../src/components/ForgetPassword"
import Login from "../src/components/login"
import Explore from "../src/components/Explore"
import Search from "../src/components/Search"
import Notificationlist from "../src/components/Notificationlist"

function Layoutroutes() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/Home" element={<Home/>} />
        <Route path="/Explore" element={<Explore/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgetten" element={<ForgetPassword/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/notification" element={<Notificationlist/>} />
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default Layoutroutes