import { io } from "socket.io-client";

class SocketManager {
    constructor() {
        this.messageBuffer = [];
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 50;
        
        this.socket = io("http://localhost:8085", {
            transports: ["websocket"],
            cors: {
                origin: "http://localhost:3000/",
            },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            timeout: 60000,
            pingTimeout: 60000,
            pingInterval: 25000,
            autoConnect: false
        });

        this.setupEventHandlers();
        this.setupHeartbeat();
        this.setupNetworkChangeDetection();
    }

    connect() {
        console.log('Manually connecting socket');
        this.socket.connect();
    }

    disconnect() {
        console.log('Manually disconnecting socket');
        this.socket.disconnect();
        this.isConnected = false;
    }

    setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.flushMessageBuffer();
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`Disconnected: ${reason}`);
            this.isConnected = false;
            
            if (reason === 'io server disconnect' || reason === 'transport close') {
                this.reconnect();
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket Error:', error);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
            this.reconnectAttempts++;
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.socket.disconnect();
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Reconnected after ${attemptNumber} attempts`);
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('Reconnection error:', error);
        });

        this.socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect');
        });

        // Handle server heartbeat response
        this.socket.on('pong', () => {
            this.lastPongTime = Date.now();
            console.debug('Heartbeat received from server');
        });
    }

    setupHeartbeat() {
        this.lastPongTime = Date.now();
        
        // Send heartbeat every 30 seconds
        setInterval(() => {
            if (this.isConnected) {
                this.socket.emit('ping');
                
                // Check if we've missed too many heartbeats
                const timeSinceLastPong = Date.now() - this.lastPongTime;
                if (timeSinceLastPong > 90000) { // 3 missed heartbeats
                    console.warn('Missed too many heartbeats, reconnecting...');
                    this.reconnect();
                }
            }
        }, 30000);
    }

    setupNetworkChangeDetection() {
        window.addEventListener('online', () => {
            console.log('Network connection restored');
            if (!this.isConnected) {
                this.reconnect();
            }
        });

        window.addEventListener('offline', () => {
            console.log('Network connection lost');
            this.isConnected = false;
        });
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log('Attempting to reconnect...');
            setTimeout(() => {
                this.socket.connect();
            }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
        }
    }

    emit(event, data, callback) {
        if (this.isConnected) {
            this.socket.emit(event, data, callback);
        } else {
            console.log('Buffering message:', event);
            this.messageBuffer.push({ event, data, callback });
        }
    }

    flushMessageBuffer() {
        while (this.messageBuffer.length > 0 && this.isConnected) {
            const { event, data, callback } = this.messageBuffer.shift();
            console.log('Sending buffered message:', event);
            this.socket.emit(event, data, callback);
        }
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    off(event, callback) {
        this.socket.off(event, callback);
    }
}

const socketManager = new SocketManager();
export default socketManager;
