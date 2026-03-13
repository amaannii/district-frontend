import { io } from "socket.io-client";

// const socket = io("http://localhost:3001", {
//   withCredentials: true,
// });
const socket = io("https://district-backend-mjx0.onrender.com", {
  withCredentials: true,
});

export default socket;