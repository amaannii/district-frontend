
import { useEffect } from "react";
import Layoutroutes from "../Routes/Layoutroutes";
import "./App.css";
import { listenNotifications } from "./confiq/notificationListener";


function App() {

    useEffect(() => {
    listenNotifications(); // ✅ This activates popup listener
  }, []);

  return (
    <>


      <Layoutroutes/>

    </>
  );

}

export default App;

