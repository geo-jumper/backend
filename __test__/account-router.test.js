'use strict';

require('./lib/setup');
const faker = require('faker');
const superagent = require('superagent');
const {start, stop} = require('../src/lib/server');
const accountMock = require('./lib/account-mock-factory');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('account-router.js', () => {
  beforeAll(start);
  afterAll(stop);
  afterEach(accountMock.remove);


  describe('POST /signup', () => {

    test('creating account should respond with status 200 and a token if no errors', () => {
      let accountToPost = { username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(), 
      };

      return superagent.post(`${__API_URL__}/signup`)
        .send(accountToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.text).toBeTruthy();
        });
    });
    test('incomplete request should return status 400', () => {
      let accountToPost = { username: faker.internet.userName(), email: faker.internet.email() };
      return superagent
        .post(`${__API_URL__}/signup`)
        .send(accountToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test('duplicate request should return status 409', () => {
      let accountToPost = { 
        username: 'double', 
        email: 'double@double.com',
        password: 'doubledouble',
      };
      return superagent.post(`${__API_URL__}/signup`)
        .send(accountToPost)
        .then( () => {
          return superagent.post(`${__API_URL__}/signup`).send(accountToPost)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(409);
            });
        });
    });
  });

  describe('GET /login', () => {
    test('valid request should return status 200 and a token', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${__API_URL__}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.text).toBeTruthy();
        });
    });
    test('if no authentication set, should return status 400', () => {
      return accountMock.create()
        .then(() => {
          return superagent.get(`${__API_URL__}/login`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test('if user is not found, should return status 404', () => {
      return accountMock.create()
        .then(() => {
          return superagent.get(`${__API_URL__}/login`)
            .auth(faker.internet.userName(), faker.internet.password());
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

