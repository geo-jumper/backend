'use strict';

const Account = require('../../src/model/account');
const faker = require('faker');

const accountMockFactory = module.exports = {};

accountMockFactory.create = () => {
  let mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return Account.create(mock.request)
    .then(account => {
      mock.account = account;
      return account.createToken();
    })
    .then(token => {
      mock.token = token;
      return Account.findById(mock.account._id);
    })
    .then(account => {
      mock.account = account;
      return mock;
    })
    .catch(err => {
      console.error('account-mock-factory: account.create error: ', err);
    });
};

accountMockFactory.remove = () => Account.remove({});
