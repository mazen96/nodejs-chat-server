const express = require("express");
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Socket handling ////////////////////////////////////////////

io.on("connection", (socket) => {
    console.log("Server:: New connection initiated from -client- to -server- -- *connection*");

    // Manage that specific #Socket# connection //////////////

    socket.on("disconnect", () => {
        console.log("Server:: user left connction -- *disconnect*");
    });
    
});

///////////////////////////////////////////////////////////////

// Middlewares/////////////////////////////////////////////////
app.use(router);
///////////////////////////////////////////////////////////////

server.listen(PORT, () => console.log(`Server started and listening on port number: ${PORT}`));

