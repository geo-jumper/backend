'use strict';

require('./lib/setup');
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
              expect(response.body.points).toEqual(0);
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
  describe('GET /profiles', () => {
    test('should return 100 profiles', () => {
      return profileMock.createMany(150)
        .then(() => {
          return superagent.get(`${__API_URL__}/profiles`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.count).toEqual(150);
              expect(response.body.data.length).toEqual(100);
              expect(response.body.prev).toEqual(null);
              expect(response.body.next).toEqual(`${__API_URL__}/profiles?page=2`);
              expect(response.body.last).toEqual(`${__API_URL__}/profiles?page=2`);
            });
        });
    });
    test('?page=2 should return 50 profiles', () => {
      return profileMock.createMany(150)
        .then(() => {
          return superagent.get(`${__API_URL__}/profiles?page=2`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.count).toEqual(150);
              expect(response.body.data.length).toEqual(50);
              expect(response.body.next).toEqual(null);
              expect(response.body.prev).toEqual(`${__API_URL__}/profiles?page=1`);
              expect(response.body.last).toEqual(`${__API_URL__}/profiles?page=2`);
            });
        });
    });
  });

  describe('GET /profiles/:id', () => {
    test('should return status 200 and a profile', () => {
      return profileMock.create()
        .then(mockProfile => {
          return superagent.get(`${__API_URL__}/profiles/${mockProfile.profile._id}`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body).toEqual(JSON.parse(JSON.stringify((mockProfile.profile))));
            });
        });
    });
    test('should return status 404 if profile not found', () => {
      return profileMock.create()
        .then(() => {
          return superagent.get(`${__API_URL__}/profiles/dafkl32qrvas`)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });
  });
  describe('GET /profiles/me', () => {
    test('should return status 200 and a profile', () => {
      return profileMock.create()
        .then(mockProfile => {
          return superagent.get(`${__API_URL__}/profiles/me`)
            .set('Authorization', `Bearer ${mockProfile.accountMock.token}`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.account).toEqual(mockProfile.accountMock.account._id.toString());
            });
        });
    });
  });
  describe('PUT /profiles/:id', () => {
    test('should return status 200 and updated profile', () => {
      return profileMock.create()
        .then(mockProfile => {
          return superagent.put(`${__API_URL__}/profiles/${mockProfile.profile._id}`)
            .set('Authorization', `Bearer ${mockProfile.accountMock.token}`)
            .send({points: 1})
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.points).toEqual(1);
            });
        });
    });
    test('should return status 401', () => {
      return profileMock.create()
        .then(mockProfile => {
          return superagent
            .put(`${__API_URL__}/profiles/${mockProfile.profile._id}`)
            .set('Authorization', `Bearer badtoken`)
            .send({ points: 1 })
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });
});
