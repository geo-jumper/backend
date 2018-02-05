'use strict';

import * as jwt from 'jsonwebtoken';
import httpError from 'http-errors';

import Account from '../model/account';
import { promisify } from '../lib/util';

export const basicAuth = (request, response, next) => {
  let { authorization } = request.headers;
  console.log(authorization);

  if (!authorization) {
    return next(httpError(400, '__ERROR__ Authorization header required'));
  }

  let encoded = authorization.split('Basic ')[1];

  if (!encoded) {
    return next(httpError(400, '__ERROR__ Basic authorization required'));
  }

  let decoded = new Buffer(encoded, 'base64').toString();

  let [ username, password ] = decoded.split(':');

  if (!username || ! password) {
    return next(httpError(400, '__ERROR__ Username and password required'));
  }

  return Account.findOne({ username })
    .then(account => {
      if (!account) {
        throw new httpError(404, '__ERROR__ Account not found');
      }

      return account.verifyPassword(password);
    })
    .then(verifiedAccount => {
      request.account = verifiedAccount;
      return next();
    })
    .catch(next);
};

export const bearerAuth = (request, response, next) => {
  let { authorization } = request.headers;
  if (!authorization) {
    return next(httpError(400, '__ERROR__ No Authorization header'));
  }

  let token = authorization.split('Bearer ')[1];
  if (!token) {
    return next(httpError(400, '__ERROR__ Token required'));
  }

  return promisify(jwt.verify)(token, process.env.SECRET)
    .then(({ randomHash }) => Account.findOne({ randomHash }))
    .then(account => {
      if (!account) {
        throw new httpError(401, '__ERROR__ Account not found');
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
