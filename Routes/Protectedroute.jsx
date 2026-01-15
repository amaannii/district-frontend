import React from 'react'
import { Navigate } from "react-router-dom";

function Protectedroute({children}) {
  const token = localStorage.getItem("adminToken");

  return token ? children : <Navigate to="/adminlogin" />;
}

export default Protectedroute