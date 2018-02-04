'use strict';

import { log } from '../lib/logger';

module.exports = (error, request, response, next) => {
  // ================ HTTP ERRORS ================
  log('info', `__MIDDLEWARE_IS_HANDLING_ERROR__ `);
  log('error', error);

  if (error.status) {
    log('info', `Responding with a ${error.status} status due to: '${error.message}'`);
    return response.sendStatus(error.status);
  }

  // ================ MONGO ERRORS ================
  let message = error.message.toLowerCase();

  if (message.includes('objectid failed')) {
    log('info', 'Responding with a 404 status code - objectid failed');
    return response.sendStatus(404);
  }

  if (message.includes('validation failed')) {
    log('info', 'Responding with a 400 status code - validation failed');
    return response.sendStatus(400);
  }

  if (message.includes('duplicate key')) {
    log('info', 'Responding with a 409 status code - duplicate key');
    return response.sendStatus(409);
  }

  if (message.includes('unauthorized')) {
    log('info', 'Responding with a 401 status code - unauthorized');
    return response.sendStatus(401);
  }

  // ================ JSON_WEB_TOKEN ERRORS ================
  if (message.includes('jwt malformed')) {
    log('info', 'Responding with a 401 status code - jsonWebToken Malformed');
    return response.sendStatus(401);
  }

  // ================ ELSE ================
  log('info', 'Responding with a 500 status code');
  log('error', error);
  return response.sendStatus(500);
};
