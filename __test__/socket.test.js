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
// let ioOptions = {};
let sender, receiver, p3;

describe('socket.io', () => {
  // beforeEach(() => {
  //   // start();
  //   return sender = io(__API_URL__, ioOptions);
   
  // });
  // beforeEach(() =>{
  //   return receiver = io(__API_URL__, ioOptions);
  // });
  afterEach(() => {
    // return sender.disconnect();
    
    // stop();
  });
  afterEach(() => {
    // return receiver.disconnect();
  });
  describe('player updates', () => {
    test('emitted player object should be received', (done) => {
      let playerObject = {
        direction: 'right',
        characterStatus: [1,2,3,4,5,6,7,8],
      };
      let badObject = {
        direction: 'left',
        characterStatus: [1,2],
      };
      // console.log('sender', sender);
      // console.log('receiver', receiver);

      sender = io(__API_URL__, ioOptions);
      
      
      
      sender.on('connection', () => {
        console.log('sender connected');
        receiver = io(__API_URL__, ioOptions);
        receiver.on('connection', () => {
          console.log('receiver connected');
          p3 = io(__API_URL__, ioOptions);
          p3.on('connection', () => {
            console.log('p3 connected');
            sender.emit('join-room');
            receiver.emit('join-room');
            p3.emit('join-room');
            sender.on('match-found', () => {
              console.log('sender match found');
            });
            receiver.on('match-found', () => {
              console.log('receiver match found');
            });
            p3.on('match-found', () => {
              console.log('p3 match found');
            });
            done();
          });
        });
      });
      
      // p3.emit('join-room');
      
      
      // sender.emit('update-player', playerObject);
      // receiver.on('render-players', function(msg) {
      //   console.log(msg);
      //   expect(msg).toEqual(badObject);
      //   expect(1).toEqual(2);
      // });
      // done();
    });
  });
});