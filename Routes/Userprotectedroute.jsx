import { Navigate } from "react-router-dom";


function Userprotectedroute({children}) {
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("role");
  if (token) {
    if (role == "User") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/" />;
  }
}

export default Userprotectedroute;
