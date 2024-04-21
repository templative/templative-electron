import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000/",
    },
    reconnection: true,              // Whether to reconnect automatically
    reconnectionAttempts: Infinity,  // Number of reconnection attempts before giving up
    reconnectionDelay: 1000,         // How long to initially wait before attempting a new reconnection (ms)
    reconnectionDelayMax: 5000,      // Maximum amount of time to wait between reconnection attempts (ms)
    randomizationFactor: 0.5         // Random factor for delay, 0.5 to spread out the reconnection attempts
});
socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('disconnect', (reason) => {
  console.log(`Disconnected: ${reason}`);
  if (reason === 'io server disconnect') {
      // Reconnect manually if the server disconnects
      socket.connect();
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
});

export default socket
