'use strict';

import { Router } from 'express';
import httpError from 'http-errors';
import Profile from '../model/profile';
import { bearerAuth } from '../middleware/auth-middleware';

export default new Router()
  .post('/profiles', bearerAuth, (request, response, next) => {
    Profile.create(request)
      .then(response.json)
      .catch(next);
  })
  .get('/profiles', (request, response, next) => {
    Profile.fetch(request)
      .then(response.page)
      .catch(next);
  })
  .get('/profiles/me', bearerAuth, (request, response, next) => {
    Profile.findOne({ account: request.account._id })
      .then(profile => {
        if (!profile) {
          return next(httpError(404, '__ERROR__ Profile not found'));
        }
        return response.json(profile);
      })
      .catch(next);
  })
  .get('/profiles/:id', (request, response, next) => {
    Profile.fetchOne(request)
      .then(response.json)
      .catch(next);
  })
  .put('/profiles/:id', bearerAuth, (request, response, next) => {
    Profile.update(request)
      .then(response.json)
      .catch(next);
  });
