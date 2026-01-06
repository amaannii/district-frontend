import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/components/Home"
import Login from "../src/components/login"
import Signup from "../src/components/Signup"
import ForgetPassword from "../src/components/ForgetPassword"

function Layoutroutes() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgetten" element={<ForgetPassword/>} />
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default Layoutroutes