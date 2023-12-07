import { io } from "socket.io-client";

export const socket = io("localhost:8080/", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000/",
    },
});