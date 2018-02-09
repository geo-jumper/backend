'use strict';

require('./lib/setup');
const { start, stop } = require('../src/lib/server');
const io = require('socket.io-client');
const __API_URL__ = `http://localhost:${process.env.PORT}`;
let ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
  multiplex: false,
};

let sender, receiver, p3;

describe('socket.io', () => {
  beforeEach(start);
  afterEach(stop);

  describe('player updates', () => {
    test('emitted player object should be received', (done) => {
      sender = io(__API_URL__, ioOptions);

      sender.on('connection', () => {
        receiver = io(__API_URL__, ioOptions);
        receiver.on('connection', (value) => {
          // 'connection sends a value of 1.  This is not used by the app.  For testing only.
          expect(value).toBe(1);
          p3 = io(__API_URL__, ioOptions);
          p3.on('connection', () => {
            sender.emit('join-room');
            receiver.emit('join-room');
            p3.emit('join-room');
            sender.on('match-found', () => {
            });
            receiver.on('match-found', () => {
            });
            p3.on('match-found', () => {
            });
            done();
          });
        });
      });
    });
  });
});
