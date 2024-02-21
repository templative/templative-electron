import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000/",
    },
});

export default socket
