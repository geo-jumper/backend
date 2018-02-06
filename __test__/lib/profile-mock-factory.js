'use strict';

const Profile = require('../../src/model/profile');
const accountMockFactory = require('./account-mock-factory');
const faker = require('faker');

const profileMockFactory = module.exports = {};

profileMockFactory.create = () => {
  const mock = {};
  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      console.log('profile-mock-factory accountMock.request',accountMock.request);
      return new Profile({
        name: mock.accountMock.request.username,
        account: mock.accountMock.account._id,
      }).save();
    })
    .then(profile => {
      mock.profile = profile;
      return mock;
    });
};

profileMockFactory.createMany = (num = 10) => {
  return Promise.all(new Array(num)
    .fill(0)
    .map(() => profileMockFactory.create()));
};

profileMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Profile.remove({}),
  ]);
};