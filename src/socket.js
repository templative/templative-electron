import { io } from "socket.io-client";

const socket = io("http://localhost:8085", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000/",
    },
    reconnection: true,              // Whether to reconnect automatically
    reconnectionAttempts: Infinity,  // Number of reconnection attempts before giving up
    reconnectionDelay: 1000,         // How long to initially wait before attempting a new reconnection (ms)
    reconnectionDelayMax: 5000,      // Maximum amount of time to wait between reconnection attempts (ms)
    randomizationFactor: 0.5,        // Random factor for delay, 0.5 to spread out the reconnection attempts
    timeout: 60000,                 // Added timeout
    pingTimeout: 60000,             // Match server ping timeout
    pingInterval: 25000,             // Match server ping interval
    autoConnect: true
});

socket.on('error', (error) => {
    console.error('Socket Error:', error);
});

socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
});

socket.on('connect', () => {
    console.log('Connected!');
});

socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`);
    if (reason === 'io server disconnect' || reason === 'transport close') {
        // Try to reconnect
        setTimeout(() => {
            socket.connect();
        }, 1000);
    }
});

socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
});

// Add heartbeat to check connection
setInterval(() => {
    if (socket.connected) {
        socket.emit('ping');
    }
}, 30000);

// Handle server response to ping
socket.on('pong', () => {
    console.debug('Server responded to ping');
});

export default socket;
