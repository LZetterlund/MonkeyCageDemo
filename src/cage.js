// const calculate = require('./calculate.js');

// create username array
let usernames = [];

// when player joins game
const onJoined = (data, sentIO, sock) => {
  // send the io and the socket
  const io = sentIO;
  const socket = sock;

  // stop joining the session at 8 players in lobby, or if game started
  if (usernames.length >= 20) {
    io.sockets.in(socket.room).emit('lobbyTaken');
    console.log('Why are there more than 20 people here lmao');
  } else {
    // object holding every username, create if doesn't exist
    usernames[usernames.length] = { ID: data.userID };

    // tell the client they are connected
    socket.emit('joinedCage');

    // send everyone in the room the username list
    io.sockets.in(socket.room).emit('fillUsernameList', usernames);
  }
};

// Whatever disconnect things need to be done
const sendLeaveData = (data, sentIO, sock) => {
  // send the io and the socket
  const io = sentIO;
  const socket = sock;

    //remove disconnected users from the usernames array
  usernames = usernames.filter(obj => obj.ID !== socket.user);
    
  // send everyone in the room the username list
  io.sockets.in(socket.room).emit('fillUsernameList', usernames);

  console.log(`${socket.user} left room ${socket.room}`);
  socket.leave(socket.room);
};

// set up the sockets
const connectSocketServer = (io) => {
  io.on('connection', (sock) => {
    const sentIO = io;
    const socket = sock;

    socket.on('join', (data) => {
      // const room = data.roomID; //for if multiple rooms are needed
      const room = 'monkeyCage';
      const user = data.userID;
      socket.room = room;
      socket.user = user;
      console.log(`${user} joined room ${room}`);
      socket.join(room);
      onJoined(data, sentIO, socket);
    });
    // my disconnect function that removes players from the proper rooms
    socket.on('sendLeaveData', (data) => {
      sendLeaveData(data);
    });
    socket.on('disconnect', () => {
      // purge user from array
      usernames.filter(obj => obj.ID === socket.user).pop();
      const data = { roomID: socket.room, userID: socket.user };
      sendLeaveData(data, sentIO, socket);
    });
  });
};

module.exports.connectSocketServer = connectSocketServer;
