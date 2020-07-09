const express = require("express");
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const {addUser, removeUser, getUser, getRoomUsers} = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Socket handling ////////////////////////////////////////////

io.on("connection", (socket) => {
    console.log("Server:: New connection initiated from -client- to -server- -- *connection*");

    // Manage this specific #Socket# connection //////////////

    socket.on("join", ({name, room}, callback) => {
        
        // add user to users storage DB/In-memory array.
        const {error, user} = addUser({socketId: socket.id, name, room});

        if(error){
            // if error occurs while adding user to storage we use this
            // callback to pass that error to the client/front-end
            // then we abort this operation by returning.
            return callback(error);
        }

        // Now we need to make this user join the chat room.
        socket.join(user.room);
        
        // Emit admin messages for current user and all users of the room
        socket.emit('message', {user: 'Admin', text: `${user.name}, Welcome to room - ${user.room} -`});
        socket.broadcast.to(user.room).emit('message', {user: 'Admin', text: `${user.name}, has joined !`});

        // call the callback here as a dummy call and it won't be used
        // at client side as there is no error
        //callback();
    });

    // Handle on recieving user message and then re-broadcasting it to
    // all users in the same room.

    socket.on('userMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});

        // call the callback here as a dummy call and it won't be used
        // at client side as there is no error
        //callback();
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
        console.log("Server:: user left connction -- *disconnect*");
    });
    
});

///////////////////////////////////////////////////////////////

// Middlewares/////////////////////////////////////////////////
app.use(router);
///////////////////////////////////////////////////////////////

server.listen(PORT, () => console.log(`Server started and listening on port number: ${PORT}`));

