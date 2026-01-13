import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/components/Home"
import Signup from "../src/components/Signup"
import ForgetPassword from "../src/components/ForgetPassword"
import Login from "../src/components/login"
import Explore from "../src/components/Explore"
import Sidebar from "../src/components/Sidebar"

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
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default Layoutroutes