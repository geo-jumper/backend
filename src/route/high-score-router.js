'use strict';

import { Router } from 'express';
import HighScore from '../model/high-score';

export default new Router()
  .get('/highscores', (request, response, next) => {
    HighScore.fetch()
      .then(scoreObj => {
        response.send(scoreObj);
      })
      .catch(next);
  });

