'use strict';

require('./lib/setup');

const superagent = require('superagent');
const { start, stop } = require('../src/lib/server');


const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('high-score-router.js', () => {
  beforeAll(start);
  afterAll(stop);

  describe('GET /highscores', () => {
    test('should return an object with all the high scores', () => {
      return superagent.get(`${__API_URL__}/highscores`)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
});