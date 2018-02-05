import uuidv1 from 'uuid';
let room = 'default';
let MAX_USERS = 2;

export const socketInit = server => {
  const io = require('socket.io')(server);

  // open cors
  io.set('origins', 'http://localhost:8080');

  // Localized state to change into DB state
  const USERS = {};
  const ROOMS = {};

  io.on('connection', socket => {

    if (MAX_USERS === 0) {
      MAX_USERS = 2;
      room = uuidv1();
    }

    MAX_USERS--;

    socket.join(room);
    console.log('user joined room', room);

    USERS[socket.id] = {};
    USERS[socket.id].username = 'anon';
    USERS[socket.id].room = room;

    socket.on('disconnect', () => {
      socket.leave(room);
      console.log('LEFT', socket.id);
    });

    socket.on('send-message', data => {
      data.username = USERS[socket.id].username;
      data.timestamp = new Date();

      console.log('Message:', data);
      io.in(USERS[socket.id].room).emit('receive-message', data);
    });

    socket.on('set-username', data => {
      USERS[socket.id].username = data.username;
    });
  });
};
