const socketIo = require('socket.io');
let io;

module.exports = {
    initIO: (server) => {
        io = socketIo(server, {
            cors: {
                origin: process.env.NODE_ENV === 'production' 
                    ? 'https://your-app-name.onrender.com' 
                    : 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
}; 