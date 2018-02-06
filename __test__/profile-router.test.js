'use strict';

require('./lib/setup');
const faker = require('faker');
const superagent = require('superagent');
const { start, stop } = require('../src/lib/server');
const accountMock = require('./lib/account-mock-factory');
const profileMock = require('./lib/profile-mock-factory');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('profile-router.js', () => {
  beforeAll(start);
  afterAll(stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('should return status 200 if there are no errors', () => {
      let tempAccountMock = null;
      return accountMock.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${__API_URL__}/profiles`)
            .set('Authorization', `Bearer ${tempAccountMock.token}`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(tempAccountMock.account.username);
              expect(response.body.account).toEqual(tempAccountMock.account._id.toString());
              expect(response.body.wins).toEqual(0);
            });
        });
    });
    test('should return 401 if post is unauthorized / bad token', () => {
      return accountMock.create()
        .then(() => {
          superagent.post(`${__API_URL__}/profiles`)
            .set('Authorization', `Bearer badToken`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });
  describe.skip('GET /profiles', () => {
    test('should return 100 profiles', () => {
      return profileMock.createMany(2)
        .then((profileData) => {
          return superagent.get(`${__API_URL__}/profiles`)
            .then(response => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });
});