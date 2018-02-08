import uuidv1 from 'uuid';
let room = 'default';
let MAX_USERS = 2;

export const socketInit = server => {
  const io = require('socket.io')(server);

  // open cors
  io.set('origins', '*:*');

  // Localized state to change into DB state
  const USERS = {};

  io.on('connection', socket => {
    console.log('connection');
    socket.emit('connection', 1);
    socket.on('join-room', () => {
      if (MAX_USERS === 0) {
        MAX_USERS = 2;
        room = uuidv1();
      }

      MAX_USERS--;
      console.log('max users', MAX_USERS);
      socket.join(room);
      console.log('user joined room', room);

      USERS[socket.id] = {};
      USERS[socket.id].room = room;

      if (MAX_USERS === 0) {
        io.in(USERS[socket.id].room).emit('match-found');
      }

      socket.on('disconnect', () => {
        socket.leave(room);
        console.log('LEFT', socket.id);
      });

      socket.on('update-player', (playerObject) => {
        socket.broadcast.to(USERS[socket.id].room).emit('render-players', playerObject);
      });
    });
  });
};
