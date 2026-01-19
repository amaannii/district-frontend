import React from 'react'
import { Navigate } from "react-router-dom";

function Protectedroute({children}) {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");
  if(token){
    if(role=="admin"){
      return children
    }else{
      return <Navigate to="/" />
    }

  }else{
   return <Navigate to="/adminlogin" />
  }


}

export default Protectedroute