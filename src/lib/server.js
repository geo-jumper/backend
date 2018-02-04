'use strict';

import * as db from './db';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import cors from 'cors';
import routes from '../route';
import { socketInit } from '../socketIO';

import { log } from './logger';

const state = {
  isOn: false,
  http: null,
};

const app = express();

// Global bodyParser
app.use(bodyParser.json());

// open cors
app.use(cors());

// Routes and middleware
app.use(routes);

// Static mounts
app.use(express.static(__dirname + '../../../public'));

// catch all 404
app.all('*', (request, response) => {
  return response.status(404).send('Hi I\'m 10 and what is this?');
});

export const start = () => {
  // gitignorable logs file
  fs.pathExists('logs/')
    .then(exists => {
      if (!exists) {
        fs.mkdir('logs/');
      }
    });

  return new Promise((resolve, reject) => {
    if (state.isOn) {
      log('error', '__SERVER_ERROR__ Server is already on');
      return reject(new Error('__SERVER_ERROR__ Server is already on'));
    }
    state.isOn = true;
    return db.start()
      .then(() => {
        state.http = app.listen(process.env.PORT, () => {
          log('info', `Server is listening on port: ${process.env.PORT}`);
          return resolve();
        });

        // setup socket.io
        socketInit(state.http);
      })
      .catch(reject);
  });
};

export const stop = () => {
  return new Promise((resolve, reject) => {
    if (!state.isOn) {
      log('error', '__SERVER_ERROR__ Server already not on');
      return reject(new Error('__SERVER_ERROR__ Server is not on'));
    }
    return db.stop()
      .then(() => {
        state.http.close(() => {
          log('info', 'Server is shutting down');
          state.isOn = false;
          state.http = null;
          return resolve();
        });
      })
      .catch(reject);
  });
};
