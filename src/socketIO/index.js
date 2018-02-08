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
      USERS[socket.id].username = 'anon';
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

      socket.on('set-username', data => {
        USERS[socket.id].username = data.username;

      });
      socket.on('capture-star', levelResults => {
        let { level, score } = levelResults;
        let { username } = USERS[socket.id];
        console.log(level);
        console.log(score);
        console.log(username);

        let newScore = {};
        newScore.level = level;
        newScore.score = score;
        newScore.username = username;

        HighScore.update(newScore);
        socket.broadcast.to(USERS[socket.id].room).emit('return-star', { username });
      });

      socket.on('total-score', sumOfLevels => {
        let { level, score } = sumOfLevels; // level === 0, sum === total;
        let { username } = USERS[socket.id];
        console.log(level);
        console.log(score);
        console.log(username);

        let newScore = {};
        newScore.level = level;
        newScore.score = score;
        newScore.username = username;

        HighScore.update(newScore);
      });
    });
  });
};
