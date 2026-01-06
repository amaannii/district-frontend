import "./App.css";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import Login from "./components/login";
import Search from "./components/Search";
import Signup from "./components/Signup";

function App() {
  return (
    <>

      <Login />
      <Signup />
      <ForgetPassword />
      <Home/>
       <Search/>
    </>
  );
}

export default App;
