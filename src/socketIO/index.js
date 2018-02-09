import uuidv1 from 'uuid';
import HighScore from '../model/high-score';
let room = 'default';
let MAX_USERS = 2;

export const socketInit = server => {
  const io = require('socket.io')(server);

  // open cors
  io.set('origins', '*:*');

  // Localized state to change into DB state
  const USERS = {};

  io.on('connection', socket => {
    socket.emit('connection', 1);
    socket.on('join-room', () => {
      if (MAX_USERS === 0) {
        MAX_USERS = 2;
        room = uuidv1();
      }

      MAX_USERS--;
      console.log('info', `max users: ${MAX_USERS}`);
      console.log('info', `user joined room: ${room}`);
      socket.join(room);

      USERS[socket.id] = {};
      USERS[socket.id].room = room;

      if (MAX_USERS === 0) {
        io.in(USERS[socket.id].room).emit('match-found');
      }

      socket.on('disconnect', () => {
        MAX_USERS = 2;
        socket.leave(room);
        console.log('info', `LEFT: ${socket.id}`);
      });

      socket.on('get-player-username', () => {
        let { username } = USERS[socket.id];
        socket.emit('send-player-username', username);
      });

      socket.on('update-player', (playerObject) => {
        playerObject.username = USERS[socket.id].username;
        socket.broadcast.to(USERS[socket.id].room).emit('render-players', playerObject);
      });

      socket.on('set-username', data => {
        USERS[socket.id].username = data;

      });
      socket.on('capture-star', levelResults => {
        let { level, score } = levelResults;
        let { username } = USERS[socket.id];

        let newScore = {};
        newScore.level = level;
        newScore.score = score;
        newScore.username = username;

        HighScore.update(newScore);
        socket.broadcast.to(USERS[socket.id].room).emit('return-star', { username });
      });

      socket.on('total-score', sumOfLevels => {
        let { level, score } = sumOfLevels; // level === 0, score === total of all levels;
        let { username } = USERS[socket.id];

        let newScore = {};
        newScore.level = level;
        newScore.score = score;
        newScore.username = username;

        HighScore.update(newScore);
      });
    });
  });
};
