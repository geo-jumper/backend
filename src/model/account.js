'use strict';

import mongoose, { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import httpError from 'http-errors';

// Schema
const accountSchema = new Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    unique: true,
  },
});

// Instance Methods
accountSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then(response => {
      if (!response) {
        throw new httpError(401, '__AUTHORIZATION__ Incorrect username or password');
      }
      return this;
    });
};

accountSchema.methods.createToken = function() {
  this.tokenSeed = crypto.randomBytes(64).toString('hex');

  return this.save()
    .then(account => {
      return jwt.sign({ tokenSeed: account.tokenSeed }, process.env.SECRET);
    })
    .then(token => {
      return token;
    });
};

// Model
const Account = mongoose.model('account', accountSchema);

Account.create = account => {
  if (!account.password || !account.email || !account.username) {
    return Promise.reject(
      httpError(400, '__VALIDATION__ Missing username email or password'));
  }

  let { password } = account;

  account = Object.assign({}, account, { password: undefined });
  const HASH_SALT_ROUNDS = 1;

  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then(passwordHash => {
      let data = Object.assign({}, account, { passwordHash });
      return new Account(data).save();
    });
};

// Interface
export default Account;
