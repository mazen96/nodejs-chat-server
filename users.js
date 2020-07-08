let users = [];

const addUser = ({socketId, name, room}) => {
     
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    // check if a user with the same name exists in the same room
    let userAlreadyExist = users.find((user) => user.name === name && user.room === room ? true : false);

    if(userAlreadyExist)
    {
        return {error: 'A user already exists with the same name.'}
    }

    let user = {socketId, name, room};
    users.push(user);

    // VII: we need to capsulate user in {} so that when we destructure
    // it when used it destructre properly.
    return {user};
}

const removeUser = (socketId) => {

    // Note that we define each user by its socketId as it is unique
    // for all users
    let userIndex = users.findIndex((user) => user.socketId === socketId);
    if(userIndex !== -1){
        return users.splice(userIndex, 1)[0];
    }
}

const getUser = (socketId) => {
    return users.find((user) => user.socketId === socketId);
}

const getRoomUsers = (room) => {
    return users.filter((user) => user.room === room);
}

module.exports = {addUser, removeUser, getUser, getRoomUsers};