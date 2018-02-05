'use strict';

import { log } from './logger';
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const state = { isOn: false };

export const start = () => {
  log('info', 'Database is up');
  if (state.isOn) {
    return Promise.reject(new Error('__DB_ERROR__ Database is already up'));
  }
  state.isOn = true;
  return mongoose.connect(process.env.MONGODB_URI);
};

export const stop = () => {
  log('info', 'Database shutting down');
  if (!state.isOn) {
    return Promise.reject(new Error('__DB_ERROR__ db is not up'));
  }
  state.isOn = false;
  return mongoose.disconnect();
};
