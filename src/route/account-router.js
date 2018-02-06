'use strict';

import { Router } from 'express';
import Account from '../model/account';
import { basicAuth } from '../middleware/auth-middleware';
import httpError from 'http-errors';

export default new Router()
  .post('/signup', (request, response, next) => {
    return Account.create(request.body)
      .then(account => account.createToken())
      .then(token => {
        response.cookie('X-SOCKET-TOKEN', token, { maxAge: 900000 });
        response.send(token);
      })
      .catch(next);
  })
  .get('/login', basicAuth, (request, response, next) => {
    return request.account.createToken()
      .then(token => {
        let cookieOptions = { maxAge: 900000 };
        response.cookie('X-SOCKET-TOKEN', token, cookieOptions);
        response.send(token);
      })
      .catch(next);
  });
